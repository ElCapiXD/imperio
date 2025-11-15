import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface Exercise {
  name: string;
  sets: string; // e.g. "4x10"
  note?: string;
}

@Component({
  selector: 'app-routine-detail',
  templateUrl: './routine-detail.page.html',
  styleUrls: ['./routine-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class RoutineDetailPage implements OnInit {
  routineName = 'Rutina';
  exercises: Exercise[] = [];

  private routinesMap: Record<string, Exercise[]> = {
    'Pecho y Tríceps': [
      { name: 'Press banca', sets: '4 x 10' },
      { name: 'Aperturas con mancuernas', sets: '3 x 12' },
      { name: 'Fondos en paralelas', sets: '3 x 10' },
      { name: 'Extensiones de tríceps en polea', sets: '3 x 12' },
    ],
    'Espalda y Bíceps': [
      { name: 'Dominadas', sets: '4 x 6-10' },
      { name: 'Remo con barra', sets: '4 x 8-10' },
      { name: 'Curl bíceps con barra', sets: '3 x 10' },
      { name: 'Remo con mancuerna', sets: '3 x 12' },
    ],
    'Piernas': [
      { name: 'Sentadillas', sets: '4 x 8-10' },
      { name: 'Prensa', sets: '3 x 10-12' },
      { name: 'Peso muerto rumano', sets: '3 x 8-10' },
      { name: 'Elevaciones de talón (gemelos)', sets: '4 x 12-15' },
    ],
    'Full Body': [
      { name: 'Sentadilla', sets: '3 x 8-10' },
      { name: 'Press banca', sets: '3 x 8-10' },
      { name: 'Remo', sets: '3 x 8-10' },
      { name: 'Core (plank)', sets: '3 x 45s' },
    ],
    'Cardio / HIIT': [
      { name: 'Sprints 30s / 60s descanso', sets: '10 series' },
      { name: 'Burpees', sets: '4 x 15' },
      { name: 'Saltos de caja', sets: '4 x 12' },
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const rawName = params.get('name');
      if (rawName) {
        const decodedName = decodeURIComponent(rawName.replace(/-/g, ' '));
        this.routineName = decodedName;
        this.exercises = this.routinesMap[decodedName] ?? [
          { name: 'Ejercicio ejemplo 1', sets: '3 x 10' }
        ];
      } else {
        this.routineName = 'Rutina';
        this.exercises = [{ name: 'Ejercicio ejemplo', sets: '3 x 10' }];
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  async openExerciseDetail(ex: Exercise) {
    const t = await this.toastCtrl.create({
      message: `${ex.name} — ${ex.sets}`,
      duration: 1200,
      position: 'bottom',
      color: 'dark'
    });
    await t.present();
  }

  // ✅ Nuevo método: registra rutina en Firestore
  async startRoutine() {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getFirestore();

    if (!user) {
      const toast = await this.toastCtrl.create({
        message: 'Debes iniciar sesión para registrar la rutina.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    try {
      await addDoc(collection(db, 'progresos'), {
        usuarioId: user.uid,
        rutina: this.routineName,
        ejerciciosCompletados: this.exercises.length,
        fecha: serverTimestamp(),
      });

      const toast = await this.toastCtrl.create({
        message: `✅ Rutina "${this.routineName}" registrada exitosamente.`,
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      this.navCtrl.back();
    } catch (error) {
      console.error('Error al registrar rutina:', error);
      const toast = await this.toastCtrl.create({
        message: '❌ Error al registrar rutina.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
