import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController, AlertController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HistoryPage implements OnInit {
  historial: any[] = [];
  cargando = true;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  async cargarHistorial() {
    const auth = getAuth();
    const db = getFirestore();

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.mostrarToast('Debes iniciar sesión para ver tu historial');
        this.cargando = false;
        return;
      }

      try {
        const q = query(collection(db, 'progresos'), where('usuarioId', '==', user.uid));
        const querySnap = await getDocs(q);

        this.historial = querySnap.docs.map((d) => {
          const data = d.data();
          const fecha = data['fecha']?.seconds
            ? new Date(data['fecha'].seconds * 1000).toLocaleDateString()
            : 'Sin fecha';
          return {
            id: d.id,
            nombre: data['rutina'] || 'Rutina desconocida',
            fecha,
            duracion: '45 min aprox',
          };
        });

        this.cargando = false;
      } catch (err) {
        console.error('Error al cargar historial:', err);
        this.mostrarToast('Error al obtener historial');
        this.cargando = false;
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  // 🔥 Nuevo método con confirmación antes de eliminar
  async eliminarRegistro(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar registro',
      message: '¿Seguro que deseas eliminar este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              const db = getFirestore();
              await deleteDoc(doc(db, 'progresos', id));
              this.historial = this.historial.filter((h) => h.id !== id);
              this.mostrarToast('Registro eliminado');
            } catch (error) {
              console.error('Error al eliminar:', error);
              this.mostrarToast('Error al eliminar registro');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async mostrarToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1800,
      position: 'top',
      color: 'dark',
    });
    await toast.present();
  }
}
