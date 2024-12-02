import { isPlatform } from '@ionic/angular';
import { IonicConfig } from '@ionic/core';

export const getConfig = (): Partial<IonicConfig> => {
  if (isPlatform('ios')) {
    return {
      mode: 'ios',
      backButtonText: 'Atrás',
    };
  } else if (isPlatform('android')) {
    return {
      mode: 'md',
      backButtonText: 'Volver',
    };
  } else {
    // Configuración para PWA o web
    return {
      mode: 'md',
      backButtonText: 'Regresar',
    };
  }
};
