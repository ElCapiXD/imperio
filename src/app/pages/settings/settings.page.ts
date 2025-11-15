import { Component } from '@angular/core';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SettingsPage {
  notifications = true;
  language = 'es';

  constructor(
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  goBack() {
    this.navCtrl.back();
  }

  async changeLanguage() {
    const toast = await this.toastCtrl.create({
      message:
        this.language === 'es'
          ? 'Idioma cambiado a Español 🇪🇸'
          : 'Language changed to English 🇬🇧',
      duration: 1200,
      color: 'dark',
    });
    await toast.present();
  }

  async showAbout() {
    const toast = await this.toastCtrl.create({
      message: 'Imperio Gym v1.0 - Proyecto UCV 💪',
      duration: 1500,
      color: 'dark',
    });
    await toast.present();
  }

  async contactSupport() {
    const toast = await this.toastCtrl.create({
      message: 'Soporte: contacto@imperiogym.com 📧',
      duration: 2000,
      color: 'dark',
    });
    await toast.present();
  }
}
