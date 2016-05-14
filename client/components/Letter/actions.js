import Actions from 'redux-actions-class'

export default new Actions({
  FETCH_LETTER_SUCCESS: 'letter',
  FETCH_LETTER (issue) {
    return dispatch => (async () => {
      const req = await fetch(`/api/letter/${issue}`)
      const letter = await req.text()
      return dispatch(this.fetchLetterSuccess(letter))
    })()
  }
})
