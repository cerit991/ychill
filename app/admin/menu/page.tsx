"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const menuItemSchema = z.object({
  categoryId: z.string().min(1, "Kategori seçiniz"),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  imageUrl: z.string().url("Geçerli bir URL giriniz"),
});

const categorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalıdır"),
});

type MenuItem = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  categoryId: number;
  isActive: boolean;
};

type Category = {
  id: number;
  name: string;
  items: MenuItem[];
};

export default function MenuManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const menuItemForm = useForm<z.infer<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      categoryId: "",
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const categoryForm = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    if (editingItem) {
      menuItemForm.reset({
        categoryId: String(editingItem.categoryId),
        name: editingItem.name,
        description: editingItem.description,
        imageUrl: editingItem.imageUrl,
      });
    }
  }, [editingItem, menuItemForm]);

  const fetchMenu = async () => {
    try {
      const response = await fetch("/api/menu");
      if (!response.ok) throw new Error("Menü yüklenemedi");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Menü yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitMenuItem = async (values: z.infer<typeof menuItemSchema>) => {
    try {
      setSubmitting(true);

      if (editingItem) {
        // Güncelleme işlemi
        const response = await fetch(`/api/menu/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) throw new Error("Menü öğesi güncellenemedi");
        toast.success("Menü öğesi başarıyla güncellendi");
        setEditingItem(null);
      } else {
        // Yeni öğe ekleme
        const response = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) throw new Error("Menü öğesi eklenemedi");
        toast.success("Menü öğesi başarıyla eklendi");
      }

      menuItemForm.reset();
      fetchMenu();
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitCategory = async (values: z.infer<typeof categorySchema>) => {
    try {
      setSubmitting(true);
      const response = await fetch("/api/menu/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Kategori eklenemedi");

      toast.success("Kategori başarıyla eklendi");
      categoryForm.reset();
      fetchMenu();
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleItemStatus = async (item: MenuItem) => {
    try {
      const response = await fetch(`/api/menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });

      if (!response.ok) throw new Error("Durum güncellenemedi");

      toast.success("Menü öğesi durumu güncellendi");
      fetchMenu();
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Öğe silinemedi");

      toast.success("Menü öğesi silindi");
      fetchMenu();
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    menuItemForm.reset();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Kategori Ekleme Formu */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6">Yeni Kategori Ekle</h2>
            <Form {...categoryForm}>
              <form
                onSubmit={categoryForm.handleSubmit(onSubmitCategory)}
                className="space-y-4"
              >
                <FormField
                  control={categoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Adı</FormLabel>
                      <FormControl>
                        <Input placeholder="Kategori adı" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Kategori Ekle
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Menü Öğesi Ekleme/Düzenleme Formu */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingItem ? "Menü Öğesini Düzenle" : "Yeni Menü Öğesi Ekle"}
            </h2>
            <Form {...menuItemForm}>
              <form
                onSubmit={menuItemForm.handleSubmit(onSubmitMenuItem)}
                className="space-y-4"
              >
                <FormField
                  control={menuItemForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuItemForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İsim</FormLabel>
                      <FormControl>
                        <Input placeholder="Ürün adı" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuItemForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ürün açıklaması"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuItemForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Görsel URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editingItem ? (
                      <Save className="h-4 w-4 mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {editingItem ? "Güncelle" : "Ekle"}
                  </Button>
                  {editingItem && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      İptal
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Menü Listesi */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Menü Yönetimi</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {categories.map((category) => (
            <AccordionItem
              key={category.id}
              value={category.id.toString()}
              className="border rounded-lg"
            >
              <AccordionTrigger className="px-4">
                <span className="text-xl font-semibold">{category.name}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({category.items.length} ürün)
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="grid gap-4">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingItem(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={item.isActive ? "default" : "outline"}
                          onClick={() => toggleItemStatus(item)}
                        >
                          {item.isActive ? "Aktif" : "Pasif"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}