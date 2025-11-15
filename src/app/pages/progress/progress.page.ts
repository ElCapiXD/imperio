import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProgressPage implements OnInit {
  progreso = {
    diasEntrenados: 0,
    rutinasCompletadas: 0,
    tiempoEntrenado: '0h 0min',
    pesoActual: 74,
  };

  cargando = true;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProgreso();
  }

  async cargarProgreso() {
    const auth = getAuth();
    const db = getFirestore();

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.mostrarToast('Debes iniciar sesión para ver tu progreso');
        this.cargando = false;
        return;
      }

      try {
        const q = query(collection(db, 'progresos'), where('usuarioId', '==', user.uid));
        const querySnap = await getDocs(q);

        if (querySnap.empty) {
          this.mostrarToast('Aún no has registrado rutinas');
          this.cargando = false;
          return;
        }

        const rutinasCompletadas = querySnap.size;
        const diasSet = new Set<string>();

        querySnap.forEach((doc) => {
          const data = doc.data();
          const fecha = data['fecha']; // ✅ acceso seguro

          if (fecha && fecha.seconds) {
            const fechaStr = new Date(fecha.seconds * 1000).toDateString();
            diasSet.add(fechaStr);
          }
        });

        const diasEntrenados = diasSet.size;
        const totalMin = rutinasCompletadas * 45;
        const horas = Math.floor(totalMin / 60);
        const minutos = totalMin % 60;

        this.progreso = {
          diasEntrenados,
          rutinasCompletadas,
          tiempoEntrenado: `${horas}h ${minutos}min`,
          pesoActual: 74,
        };

        this.cargando = false;
      } catch (error) {
        console.error('Error al cargar progreso:', error);
        this.mostrarToast('Error al obtener los datos de progreso');
        this.cargando = false;
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

async verHistorial() {
  this.router.navigateByUrl('/pages/history');
}


  async mostrarToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'dark',
    });
    await toast.present();
  }
}
