export interface LensDesign {
  id: number;
  code: string;
  name: string;
  description: string;
  default_image_id?: number;
}

export interface LensMaterial {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface LensTreatment {
  id: number;
  code: string;
  name: string;
  description: string;
  default_image_id?: number;
}

export interface Verre {
  id: number;
  code_edi: string;
  n_complet: string;
  design_id?: number;
  matiere_id?: number;
  traitement_id?: number;
}

export interface ImageType {
  id: number;
  url: string;
  alt?: string;
}
