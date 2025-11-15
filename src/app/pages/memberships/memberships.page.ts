import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

interface MembershipPlan {
  name: string;
  price: string;
  features: string[];
  color: string;
}

@Component({
  selector: 'app-memberships',
  templateUrl: './memberships.page.html',
  styleUrls: ['./memberships.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MembershipsPage {
  plans: MembershipPlan[] = [
    {
      name: 'Básico',
      price: 'S/ 49 / mes',
      features: ['Acceso al gimnasio', 'Clases grupales limitadas'],
      color: '#666',
    },
    {
      name: 'Premium',
      price: 'S/ 79 / mes',
      features: ['Acceso total', 'Clases ilimitadas', 'Entrenador personalizado 1x/semana'],
      color: '#d4af37',
    },
    {
      name: 'VIP',
      price: 'S/ 129 / mes',
      features: ['Todo incluido', 'Entrenador personal diario', 'Plan nutricional exclusivo'],
      color: '#b8860b',
    },
  ];

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  goBack() {
    this.navCtrl.back();
  }

  async subscribe(plan: MembershipPlan) {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    if (!user) {
      this.showToast('Debes iniciar sesión para adquirir una membresía');
      return;
    }

    const confirm = await this.alertCtrl.create({
      header: 'Confirmar compra',
      message: `¿Deseas adquirir el plan "${plan.name}" por ${plan.price}?`, // ✅ sin <strong>
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: async () => {
            try {
              const userRef = doc(db, 'usuarios', user.uid);
              await updateDoc(userRef, {
                membresia: plan.name,
                fechaMembresia: new Date(),
              });

              this.showToast(`✅ Has adquirido el plan ${plan.name}`);
            } catch (err) {
              console.error('Error al actualizar membresía:', err);
              this.showToast('❌ Error al guardar membresía');
            }
          },
        },
      ],
    });

    await confirm.present();
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'dark',
    });
    await toast.present();
  }
}
