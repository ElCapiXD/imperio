import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProfilePage implements OnInit {
  user: any = null;
  loading = true;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  async cargarPerfil() {
    const auth = getAuth();
    const db = getFirestore();

    onAuthStateChanged(auth, async (usuarioActual) => {
      if (usuarioActual) {
        const docRef = doc(db, 'usuarios', usuarioActual.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.user = docSnap.data();
          console.log('✅ Datos del perfil cargados:', this.user);
        } else {
          console.warn('⚠️ No se encontraron datos del perfil en Firestore');
          this.mostrarToast('No se encontraron datos del perfil');
          this.user = null;
        }
      } else {
        this.user = null;
        this.router.navigateByUrl('/pages/login', { replaceUrl: true });
      }
      this.loading = false;
    });
  }

  goBack() {
    if (window.history.length > 1) {
      this.navCtrl.back();
    } else {
      this.router.navigateByUrl('/pages/home', { replaceUrl: true });
    }
  }

async editarPerfil() {
  if (!this.user) return;

  const alert = await this.alertCtrl.create({
    header: 'Editar perfil',
    inputs: [
      { name: 'nombre', type: 'text', value: this.user.nombre, placeholder: 'Nombre' },
      { name: 'telefono', type: 'text', value: this.user.telefono, placeholder: 'Teléfono' },
      { name: 'direccion', type: 'text', value: this.user.direccion, placeholder: 'Dirección' },
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Guardar',
        handler: async (data) => {
          const auth = getAuth();
          const db = getFirestore();
          const user = auth.currentUser;
          if (!user) return;

          try {
            const userRef = doc(db, 'usuarios', user.uid);
            await updateDoc(userRef, {
              nombre: data.nombre || this.user.nombre,
              telefono: data.telefono || this.user.telefono,
              direccion: data.direccion || this.user.direccion,
            });

            // Actualiza la vista local
            this.user = { ...this.user, ...data };

            this.mostrarToast('✅ Perfil actualizado correctamente');
          } catch (err) {
            console.error('Error al actualizar perfil:', err);
            this.mostrarToast('❌ Error al guardar los cambios');
          }
        },
      },
    ],
  });

  await alert.present();
}


  async cerrarSesion() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salir',
          handler: async () => {
            const auth = getAuth();
            await signOut(auth);
            this.router.navigateByUrl('/pages/login', { replaceUrl: true });
          },
        },
      ],
    });
    await alert.present();
  }

  async mostrarToast(message: string) {
    const t = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'medium',
    });
    await t.present();
  }
}
