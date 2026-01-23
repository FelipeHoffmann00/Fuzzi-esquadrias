
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// SUBSTITUA PELAS SUAS CHAVES DO PAINEL DO SUPABASE
const supabaseUrl = 'https://ircgwoyhvpnepvokswvo.supabase.co';
const supabaseAnonKey = 'sb_publishable_ug05TQnCpUManpwRLIq58A_vcI51ZUX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (file: File | string, path: string): Promise<string> => {
  try {
    let blob: Blob;
    
    if (typeof file === 'string' && file.startsWith('data:')) {
      const res = await fetch(file);
      blob = await res.blob();
    } else if (file instanceof File) {
      blob = file;
    } else {
      throw new Error("Formato de arquivo inválido");
    }

    // Criar um nome de arquivo único
    const fileExt = 'jpg';
    const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('fuzzi')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Erro no Storage do Supabase:', error.message);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('fuzzi')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error: any) {
    console.error('Erro crítico no upload:', error.message);
    // Se falhar o upload, retorna o que recebeu para não perder o dado (mesmo que base64)
    return typeof file === 'string' ? file : '';
  }
};
