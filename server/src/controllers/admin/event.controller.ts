import { Request, Response, NextFunction } from 'express'
import { Event } from '../../models/event.model'

export class EventController {
  public static async index(req: Request, res: Response, next: NextFunction): Promise<void | NextFunction> {
    try {
      const events = await Event.query()
      res.json({ message: 'success', data: events })
    } catch (err) {
      return next(err)
    }
  }

  public static async show(req: Request, res: Response, next: NextFunction): Promise<void | NextFunction> {
    const eventId = req.params.id
    if (!eventId) return next({ status: 422, message: 'id required to update Event' })
    try {
      const events = await Event.query().findById(eventId)
      res.json({ message: 'success', data: events })
    } catch (err) {
      return next(err)
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void | NextFunction> {
    const { body } = req
    if (!body) return next({ status: 422, message: 'Body required to create Event' })
    try {
      const events = await Event.query().insert(body)
      res.send({ message: 'success', data: events })
    } catch (err) {
      return next(err)
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { body } = req
    const eventId = req.params.id
    if (!eventId) return next({ status: 422, message: 'id required to update Event' })
    try {
      const events = await Event.query().patchAndFetchById(eventId, body)
      if (!events) return next({ status: 404, message: `Could not find Event with id: ${eventId}` })
      res.send({ message: 'success', data: events })
    } catch (err) {
      return next(err)
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const eventId = req.params.id
    if (!eventId) return next({ status: 422, message: 'id required to update Event' })
    try {
      const events = await Event.query().deleteById(eventId)
      if (!events) return next({ status: 404, message: `Could not find Event with id: ${eventId}. May be already deleted.` })
      res.send({ message: 'success', data: events })
    } catch (err) {
      return next(err)
    }
  }
}
