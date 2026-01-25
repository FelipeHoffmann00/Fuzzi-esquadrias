
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ircgwoyhvpnepvokswvo.supabase.co';
const supabaseAnonKey = 'sb_publishable_ug05TQnCpUManpwRLIq58A_vcI51ZUX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Faz o upload de um arquivo (File ou Base64) para o Supabase Storage.
 * Retorna a URL pública do arquivo.
 */
export const uploadFile = async (
  file: File | string, 
  path: string, 
  onProgress?: (percent: number) => void
): Promise<string> => {
  try {
    let blob: Blob;
    let contentType = 'application/octet-stream';
    let fileExt = 'bin';

    if (typeof file === 'string' && file.startsWith('data:')) {
      const parts = file.split(';');
      const mime = parts[0].split(':')[1];
      contentType = mime;
      fileExt = mime.split('/')[1] || 'bin';
      const res = await fetch(file);
      blob = await res.blob();
    } else if (file instanceof File) {
      blob = file;
      contentType = file.type;
      fileExt = file.name.split('.').pop() || 'bin';
    } else {
      throw new Error("Formato de arquivo inválido");
    }

    const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Simulação de progresso fluida para UX
    let progressInterval: number | undefined;
    if (onProgress) {
      let current = 0;
      progressInterval = window.setInterval(() => {
        current += Math.random() * 15;
        if (current >= 95) {
          clearInterval(progressInterval);
          onProgress(98);
        } else {
          onProgress(Math.floor(current));
        }
      }, 150);
    }

    const { data, error } = await supabase.storage
      .from('fuzzi')
      .upload(fileName, blob, {
        contentType,
        upsert: true
      });

    if (progressInterval) clearInterval(progressInterval);
    if (onProgress) onProgress(100);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage.from('fuzzi').getPublicUrl(data.path);
    return publicUrl;
  } catch (error: any) {
    console.error('Erro crítico no upload:', error.message);
    throw error;
  }
};

export const uploadImage = uploadFile;
