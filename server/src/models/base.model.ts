import { Model } from 'objection'

export class BaseModel extends Model {
  id: number
  created_at: string
  updated_at: string
  static get modelPaths() {
    return [__dirname];
  }
  $beforeInsert(): void {
    this.created_at = new Date().toISOString()
    this.updated_at = new Date().toISOString()
  }

  $beforeUpdate(): void {
    this.updated_at = new Date().toISOString()
  }
}