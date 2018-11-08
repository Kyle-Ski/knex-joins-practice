const express = require('express')
const router = express.Router()

// Connection to database through knex
const knex = require('../db/connection')

router.get('/', (req, res) => {
  knex('character')
    .select('character.id', 'character.name', 'movie.title', 'character.height', 'character.mass', 'force.side')
    .innerJoin('force', 'force.id', 'character.force_id')
    .innerJoin('character_movie', 'character.id', 'character_movie.character_id')
    .innerJoin('movie', 'movie.id', 'character_movie.movie_id')
    .orderBy('character.id', 'asc')
    .then(characters => {
      res.json({ characters: characters })
    })
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  knex('character')
  .select('character.id', 'character.name', 'movie.title', 'character.height', 'character.mass', 'force.side')
  .innerJoin('force', 'force.id', 'character.force_id')
  .innerJoin('character_movie', 'character.id', 'character_movie.character_id')
  .innerJoin('movie', 'movie.id', 'character_movie.movie_id')
  .where('character.id', id)
    .then(character => {
      res.json({ character: character })
    })  
})


router.post('/', (req, res, next) => {
  // Pull the data that is to be posted from the request body
  const body = req.body

  knex('character')
    .insert(body)
    .returning('*')
    .then(character => {
      res.json({ character: character[0] })
    })
})


router.put('/:id', (req, res) => {
  const id = req.params.id
  const body = req.body

  knex('character')
    .where('id', id)
    .update(body)
    .returning('*')
    .then(updatedCharacter => {
      res.json({ character: updatedCharacter[0] })
    })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id

  knex('character')
    .where('id', id)
    .delete()
    .returning('*')
    .then(deletedCharacter => {
      res.json({ character: deletedCharacter[0] })
    })
})



module.exports = router