import { UtensilsCrossed, Clock, MapPin, Phone } from 'lucide-react';
import MenuSection from '@/components/MenuSection';
import HeroSlider from '@/components/HeroSlider';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSlider />

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <UtensilsCrossed className="mx-auto h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Özel Menü</h3>
              <p className="text-muted-foreground">
                Şeflerimizin özenle hazırladığı eşsiz lezzetler
              </p>
            </div>
            <div className="text-center space-y-4">
              <Clock className="mx-auto h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Çalışma Saatleri</h3>
              <p className="text-muted-foreground">
                Her gün 11:00 - 23:00 arası hizmetinizdeyiz
              </p>
            </div>
            <div className="text-center space-y-4">
              <MapPin className="mx-auto h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Konum</h3>
              <p className="text-muted-foreground">
                Antik Side bölgesinde tarihin en ilginç noktalarında en güzel ve eşssiz lezzetler ile birlikte....
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <MenuSection />

      {/* Contact Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">İletişim</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Rezervasyon ve bilgi için bize ulaşın
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Telefon</h3>
                  <a 
                    href="tel:+90 532 540 42 22" 
                    className="text-primary hover:underline transition-colors"
                  >
                    +90 532 540 42 22
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Adres</h3>
                  <p>Side, Yasemin Sk. No: 31, 07330 Manavgat/Antalya</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Clock className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Çalışma Saatleri</h3>
                  <p>Her gün 11:00 - 23:00</p>
                </div>
              </div>
            </div>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.0456305954246!2d31.385943476114374!3d36.76822817486347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c35be42150aec1%3A0x43c94373aeea9d63!2sYou%20Chill%20Lounge!5e0!3m2!1str!2str!4v1711027026095!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurant Location"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}