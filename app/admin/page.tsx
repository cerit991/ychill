"use client";

import { useEffect, useState, useMemo } from "react";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: string;
  created_at: string;
}

const formSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  date: z.date({
    required_error: "Tarih seçiniz",
  }),
  time: z.string().min(1, "Saat seçiniz"),
  guests: z.string().min(1, "Kişi sayısı giriniz"),
  notes: z.string().optional(),
});

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [totalReservations, setTotalReservations] = useState(0);
  const [pendingReservations, setPendingReservations] = useState(0);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      time: "",
      guests: "",
      notes: "",
    },
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (reservations.length > 0) {
      setTotalReservations(reservations.length);
      setPendingReservations(reservations.filter(r => r.status === 'pending').length);
    }
  }, [reservations]);

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservation");
      if (!response.ok) throw new Error("Rezervasyonlar yüklenemedi");
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      toast.error("Rezervasyonlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const updateReservation = async (id: number, data: Partial<Reservation>) => {
    try {
      const response = await fetch(`/api/reservation/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Rezervasyon güncellenemedi");
      
      toast.success("Rezervasyon güncellendi");
      fetchReservations();
      setEditingReservation(null);
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const deleteReservation = async (id: number) => {
    try {
      const response = await fetch(`/api/reservation/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Rezervasyon silinemedi");
      
      toast.success("Rezervasyon silindi");
      fetchReservations();
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const onSubmitNewReservation = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          date: format(values.date, "yyyy-MM-dd"),
        }),
      });

      if (!response.ok) throw new Error("Rezervasyon oluşturulamadı");

      toast.success("Rezervasyon başarıyla oluşturuldu!");
      form.reset();
      setIsNewReservationOpen(false);
      fetchReservations();
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Bekliyor", className: "bg-yellow-500" },
      approved: { label: "Onaylandı", className: "bg-green-500" },
      rejected: { label: "Reddedildi", className: "bg-red-500" },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;

    return (
      <Badge className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };

  const calendarDayContent = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.reduce((acc, day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayReservations = reservations.filter(r => r.date === dateStr);
      
      acc[dateStr] = {
        total: dayReservations.length,
        totalGuests: dayReservations.reduce((sum, r) => sum + r.guests, 0),
        approved: dayReservations.filter(r => r.status === 'approved').length,
        pending: dayReservations.filter(r => r.status === 'pending').length,
      };
      
      return acc;
    }, {} as Record<string, { total: number; totalGuests: number; approved: number; pending: number }>);
  }, [reservations, selectedDate]);

  const selectedDateReservations = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return reservations.filter(r => r.date === dateStr);
  }, [reservations, selectedDate]);

  const selectedDateStats = useMemo(() => {
    const total = selectedDateReservations.length;
    const totalGuests = selectedDateReservations.reduce((sum, r) => sum + r.guests, 0);
    return { total, totalGuests };
  }, [selectedDateReservations]);

  if (loading) {
    return <div className="flex justify-center p-8">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rezervasyonlar</h1>
        <Dialog open={isNewReservationOpen} onOpenChange={setIsNewReservationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Rezervasyon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Yeni Rezervasyon</DialogTitle>
              <DialogDescription>
                Yeni bir rezervasyon oluşturun
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitNewReservation)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Soyad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ad Soyad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="Telefon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tarih</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: tr })
                                ) : (
                                  <span>Tarih seçiniz</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saat</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kişi Sayısı</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          placeholder="Kişi sayısı"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notlar</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Özel istekler"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewReservationOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button type="submit">
                    Rezervasyon Oluştur
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Rezervasyon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bekleyen Rezervasyon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReservations}</div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bugünkü Rezervasyonlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reservations.filter(r => r.date === format(new Date(), 'yyyy-MM-dd')).length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Takvim</TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  components={{
                    DayContent: ({ date }) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      const data = calendarDayContent[dateStr];
                      
                      if (!data?.total) return <span>{date.getDate()}</span>;
                      
                      return (
                        <div className="relative w-full h-full">
                          <span>{date.getDate()}</span>
                          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1">
                            {data.pending > 0 && (
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                            )}
                            {data.approved > 0 && (
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            )}
                          </div>
                        </div>
                      );
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  {format(selectedDate, 'd MMMM yyyy', { locale: tr })} Rezervasyonları
                  <span className="text-sm text-muted-foreground ml-2">
                    ({selectedDateStats.total} rezervasyon, {selectedDateStats.totalGuests} kişi)
                  </span>
                </h3>
                {selectedDateReservations.length === 0 ? (
                  <p className="text-muted-foreground">Bu tarihte rezervasyon bulunmuyor</p>
                ) : (
                  <div className="space-y-4">
                    {selectedDateReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{reservation.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {reservation.time} • {reservation.guests} kişi
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(reservation.status)}
                          <div className="flex space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateReservation(reservation.id, { status: "approved" })}
                              disabled={reservation.status === "approved"}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateReservation(reservation.id, { status: "rejected" })}
                              disabled={reservation.status === "rejected"}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => setEditingReservation(reservation)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Rezervasyon Düzenle</DialogTitle>
                                  <DialogDescription>
                                    Rezervasyon bilgilerini güncelleyin
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="name">Ad Soyad</Label>
                                    <Input
                                      id="name"
                                      defaultValue={reservation.name}
                                      onChange={(e) => {
                                        if (editingReservation) {
                                          setEditingReservation({
                                            ...editingReservation,
                                            name: e.target.value,
                                          });
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="guests">Kişi Sayısı</Label>
                                    <Input
                                      id="guests"
                                      type="number"
                                      defaultValue={reservation.guests}
                                      onChange={(e) => {
                                        if (editingReservation) {
                                          setEditingReservation({
                                            ...editingReservation,
                                            guests: parseInt(e.target.value),
                                          });
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="time">Saat</Label>
                                    <Input
                                      id="time"
                                      type="time"
                                      defaultValue={reservation.time}
                                      onChange={(e) => {
                                        if (editingReservation) {
                                          setEditingReservation({
                                            ...editingReservation,
                                            time: e.target.value,
                                          });
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingReservation(null)}
                                  >
                                    İptal
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      if (editingReservation) {
                                        updateReservation(editingReservation.id, editingReservation);
                                      }
                                    }}
                                  >
                                    Kaydet
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bu işlem geri alınamaz. Rezervasyon kalıcı olarak silinecektir.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>İptal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteReservation(reservation.id)}
                                  >
                                    Sil
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tarih/Saat</TableHead>
                        <TableHead>Müşteri</TableHead>
                        <TableHead>İletişim</TableHead>
                        <TableHead>Kişi</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations
                        .filter(r => r.date === format(selectedDate, 'yyyy-MM-dd'))
                        .map((reservation) => (
                          <TableRow key={reservation.id}>
                            <TableCell>
                              <div className="font-medium">
                                {format(new Date(reservation.date), "d MMMM yyyy", {
                                  locale: tr,
                                })}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {reservation.time}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>{reservation.name}</div>
                              {reservation.notes && (
                                <div className="text-sm text-muted-foreground">
                                  Not: {reservation.notes}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div>{reservation.email}</div>
                              <div className="text-sm text-muted-foreground">
                                {reservation.phone}
                              </div>
                            </TableCell>
                            <TableCell>{reservation.guests} kişi</TableCell>
                            <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateReservation(reservation.id, { status: "approved" })}
                                  disabled={reservation.status === "approved"}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateReservation(reservation.id, { status: "rejected" })}
                                  disabled={reservation.status === "rejected"}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8"
                                      onClick={() => setEditingReservation(reservation)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Rezervasyon Düzenle</DialogTitle>
                                      <DialogDescription>
                                        Rezervasyon bilgilerini güncelleyin
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="name">Ad Soyad</Label>
                                        <Input
                                          id="name"
                                          defaultValue={reservation.name}
                                          onChange={(e) => {
                                            if (editingReservation) {
                                              setEditingReservation({
                                                ...editingReservation,
                                                name: e.target.value,
                                              });
                                            }
                                          }}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="guests">Kişi Sayısı</Label>
                                        <Input
                                          id="guests"
                                          type="number"
                                          defaultValue={reservation.guests}
                                          onChange={(e) => {
                                            if (editingReservation) {
                                              setEditingReservation({
                                                ...editingReservation,
                                                guests: parseInt(e.target.value),
                                              });
                                            }
                                          }}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="time">Saat</Label>
                                        <Input
                                          id="time"
                                          type="time"
                                          defaultValue={reservation.time}
                                          onChange={(e) => {
                                            if (editingReservation) {
                                              setEditingReservation({
                                                ...editingReservation,
                                                time: e.target.value,
                                              });
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => setEditingReservation(null)}
                                      >
                                        İptal
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          if (editingReservation) {
                                            updateReservation(editingReservation.id, editingReservation);
                                          }
                                        }}
                                      >
                                        Kaydet
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Bu işlem geri alınamaz. Rezervasyon kalıcı olarak silinecektir.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>İptal</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteReservation(reservation.id)}
                                      >
                                        Sil
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}