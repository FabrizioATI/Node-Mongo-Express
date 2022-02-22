module.exports = ((request, response, next) => {
    response.status(404).send('<h1>Error 404!</h1>')
})