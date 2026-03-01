import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0F0F0F] border-t border-white/5 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <h2 className="font-sans font-medium text-3xl text-white mb-6 tracking-tight">VapeAI</h2>
            <p className="text-[#B5B5B5] mb-6 leading-relaxed">
              Премиальный маркетплейс вейпов и жидкостей с умным подбором от ИИ. 
              Найдите свой идеальный вкус вместе с нами.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#B5B5B5] hover:text-white hover:bg-white/10 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#B5B5B5] hover:text-white hover:bg-white/10 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#B5B5B5] hover:text-white hover:bg-white/10 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Навигация</h3>
            <ul className="space-y-4">
              <li><Link href="/#products" className="text-[#B5B5B5] hover:text-white transition-colors">Каталог</Link></li>
              <li><Link href="/dashboard/buyer" className="text-[#B5B5B5] hover:text-white transition-colors">Личный кабинет</Link></li>
              <li><Link href="/dashboard/seller" className="text-[#B5B5B5] hover:text-white transition-colors">Продать товар</Link></li>
              <li><Link href="#" className="text-[#B5B5B5] hover:text-white transition-colors">О нас</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Поддержка</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[#B5B5B5] hover:text-white transition-colors">Доставка и оплата</Link></li>
              <li><Link href="#" className="text-[#B5B5B5] hover:text-white transition-colors">Возврат товара</Link></li>
              <li><Link href="#" className="text-[#B5B5B5] hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-[#B5B5B5] hover:text-white transition-colors">Политика конфиденциальности</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[#B5B5B5]">
                <MapPin className="w-5 h-5 text-white shrink-0" />
                <span>Москва, Пресненская наб., 12<br/>Москва-Сити, Башня Федерация</span>
              </li>
              <li className="flex items-center gap-3 text-[#B5B5B5]">
                <Phone className="w-5 h-5 text-white shrink-0" />
                <span>+7 (999) 123-45-67</span>
              </li>
              <li className="flex items-center gap-3 text-[#B5B5B5]">
                <Mail className="w-5 h-5 text-white shrink-0" />
                <span>support@vapeai.ru</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-6 border border-white/5 rounded-2xl bg-[#171717] mb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-[#B5B5B5] leading-relaxed font-bold">
            ПРЕДУПРЕЖДЕНИЕ: Данный продукт содержит никотин. Никотин вызывает сильное привыкание. 
            Продажа несовершеннолетним строго запрещена.
          </p>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#B5B5B5]">
          <p>© 2026 VapeAI Marketplace. Все права защищены.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Условия использования</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
