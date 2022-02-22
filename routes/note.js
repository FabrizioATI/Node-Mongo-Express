//require('dotenv').config()
//const { response, request } = require('express')

require("../mongo.js")
const express = require('express')

const Note = require('../models/note')

//Middlewares
const notFound = require('../middleware/notFound.js')
const handleError = require('../middleware/handleError.js')

//Router
const router = express.Router();

//swagger
  /**
   * @swagger
   * components:
   *    schemas:
   *        Note:
   *            type: object
   *            properties:
   *                content: 
   *                    type: string
   *                    description: the content
   *                date:
   *                    type: string
   *                    format: date
   *                    description: to date
   *                important: 
   *                    type: boolean
   *                    description: importance
   *            required:
   *                - content
   *                - important
   *            example:
   *                content: tengo un proxima nota
   *                important: true
   */

//Mostrar todas las notas
/**
 * @swagger
 * /note/api/notes:
 *  get:
 *      suammary: return all notes
 *      tags: [Note]
 *      responses:
 *          200:
 *              description: all notes
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Note'
 *                       
 */
  router.get('/api/notes', (request, response) => {
    Note.find({})
    .then(notes => {
      response.json(notes)
    })
  })
  
//Mostrar nota en especifico
/**
 * @swagger
 * /note/api/notes/{id}:
 *  get:
 *      suammary: return a notes
 *      tags: [Note]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                  type: string
 *            required: true
 *            description: a note
 *      responses:
 *          200:
 *              description: all notes
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              $ref: '#/components/schemas/Note'
 *          404:
 *              description: note not fund
 *                       
 */
  router.get('/api/notes/:id', (request, response, next) => {
    const { id } = request.params
    Note.findById(id).then(
      note => {
        if (note) {
          return response.json(note)
        } else {
          response.status(404).end()
        }
      }
    ).catch(err =>{
      next(err)
    })
  })

//Agregar una nueva nota
/**
 * @swagger
 * /note/api/notes:
 *  post:
 *      suammary: create a new note
 *      tags: [Note]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Note'
 *      responses:
 *          200:
 *              description: new note create
 */
  router.post('/api/notes', (request, response) => {
    const note = request.body
    if (!note.content) {
      return response.status(400).json({
        error: 'required "content" field is missing'
      })
    }
    const newNote = new Note({
      content: note.content,
      date: new Date(),
      important: note.important || false
    })
    newNote.save()
    .then(savedNote => {
        response.json(savedNote)
        //mongoose.connection.close()
    }).catch(err => {
        console.error(err)
    })
  })

//Modificar una nota
/**
 * @swagger
 * /note/api/notes/{id}:
 *  put:
 *      suammary: update a notes
 *      tags: [Note]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                  type: string
 *            required: true
 *            description: a note
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Note'
 *      responses:
 *          200:
 *              description: note update!
 *          404:
 *              description: note not fund
 *                       
 */
  router.put('/api/notes/:id', (request, response, next) => {
    const {id} = request.params
    const note = request.body
    const newNoteInfo = {
      content: note.content,
      important: note.important
    }
    Note.findByIdAndUpdate(id, newNoteInfo, {new: true})
    .then(result => {
      response.json(result)
      //mongoose.connection.close()
    }).catch(err => {
      next(err)
    })
  })
  
//Eliminar una nota
/**
 * @swagger
 * /note/api/notes/{id}:
 *  delete:
 *      suammary: delete a notes
 *      tags: [Note]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                  type: string
 *            required: true
 *            description: a note
 *      responses:
 *          200:
 *              description: note delete
 *          404:
 *              description: note not fund
 *                       
 */
  router.delete('/api/notes/:id', (request, response, next) => {
    const {id} = request.params
    Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
      //mongoose.connection.close()
    }).catch(err => {
      next(err)
    })
  })

  router.use(notFound)
  router.use(handleError)

  module.exports = router;