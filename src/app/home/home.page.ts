import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
standalone: true,
imports: [IonicModule, CommonModule],

})
export class HomePage {
  constructor(
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async showComingSoon(section: string) {
    const toast = await this.toastCtrl.create({
      message: `${section} próximamente disponible 👀`,
      duration: 1500,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }

navigateTo(path: string) {
  if (path === 'Rutinas') {
    this.router.navigateByUrl('/pages/routines');
  } else if (path === 'Membresías') {
    this.router.navigateByUrl('/pages/memberships');
  } else if (path === 'Perfil') {
    this.router.navigateByUrl('/pages/profile');
  } else if (path === 'Progreso') {
    this.router.navigateByUrl('/pages/progress');
  } else if (path === 'Ajustes') {
    this.router.navigateByUrl('/pages/settings');
  } else {
    this.showComingSoon(path);
  }
}





  logout() {
    this.router.navigateByUrl('/pages/login', { replaceUrl: true });
  }
}

