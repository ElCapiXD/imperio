import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.page.html',
  styleUrls: ['./routines.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class RoutinesPage {
  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  goBack() {
    this.navCtrl.back();
  }

  async openRoutine(name: string) {
  const slug = encodeURIComponent(name.replace(/\s+/g, '-')); // convierte espacios en guiones
  await this.router.navigateByUrl(`/pages/routine-detail/${slug}`);
}

}

