
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// SUBSTITUA PELAS SUAS CHAVES DO PAINEL DO SUPABASE
const supabaseUrl = 'https://ircgwoyhvpnepvokswvo.supabase.co';
const supabaseAnonKey = 'sb_publishable_ug05TQnCpUManpwRLIq58A_vcI51ZUX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (file: File | string, path: string): Promise<string> => {
  try {
    let blob: Blob;
    
    if (typeof file === 'string' && file.startsWith('data:')) {
      // Converte Base64 para Blob se necessário
      const res = await fetch(file);
      blob = await res.blob();
    } else if (file instanceof File) {
      blob = file;
    } else {
      throw new Error("Formato de arquivo inválido");
    }

    const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('fuzzi')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('fuzzi')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Erro no upload:', error);
    return typeof file === 'string' ? file : '';
  }
};
