// Usar export directamente en las declaraciones
export interface Deteccion {
  id: number;
  predio_id: number;
  trampa_id: number;
  estado_deteccion_id: number;
  fecha: string;
  imagen: string;
}
  
export interface Usuario {
  id: number;
  email: string;
  password: string;
  estado: number;
}

export interface Rol {
  id: number;
  nombre: string;
  estado: number;
}

export interface Predio {
  id: number;
  duenio_id: number;
  direccion: string;
  estado: number;
}

export interface Trampa {
  id: number;
  predio_id: number;
  usuario_id: number;
  modelo: string;
  direccion_mac: string;
  estado: number;
  coordenadas: string;
  predio: Predio;
  usuario: Usuario;
}

export interface Funcionario {
  estado: number;
  id: number;
  persona?: Persona;
  usuario?: Usuario;
  rol?: Rol;
  usuario_id: number;
  persona_id: number;
  rol_id: number;
}

export interface Persona {
  id: number;
  usuario_id: number;
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  direccion?: string;
  estado: number;
  usuario?: Usuario;
}