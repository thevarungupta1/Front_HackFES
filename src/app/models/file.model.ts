import { Associate } from './associate.model';

export class FileModel{
    id?: number;
    fileName: string;
    createdBy: number;
    
    associates?: Associate;
    }
