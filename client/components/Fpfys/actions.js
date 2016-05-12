import Actions from 'redux-actions-class'
import Cookies from 'js-cookie'

export default new Actions({

  GET_FPFYS_SUCCESS: 'fpfys',
  GET_FPFYS_FAILURE: 'err',

  GET_FPFYS () {
    return dispatch => (async () => {
      try {
        const res = await fetch('/api/fpfys')

        if (res.status !== 200) {
          dispatch(this.getFpfysFailure(`${res.status}: ${res.statusText}`))
          return
        }

        const fpfys = await res.json()
        dispatch(this.getFpfysSuccess(fpfys))

      } catch (err) {
        dispatch(this.getFpfysFailure(err))
      }
    })()
  },

  POST_FPFY_VOTE (fpfyId, vote) {

    console.log(fpfyId, vote)

    return dispatch => (async () => {

      const votes = Cookies.getJSON('fpfyVotes')

      if (!votes || !Object.keys(votes).length) {
        Cookies.set('fpfyVotes', {})
      }

      // user has not voted for this particular fpfy
      if (votes[fpfyId] === void 0) {
        votes[fpfyId] = vote
        Cookies.set('fpfyVotes', votes)

      } else {

        // this user has already voted
        return
      }

      console.log('posting', { fpfyId, vote })

      const res = await fetch('/api/fpfys/vote', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fpfyId, vote
        })
      })

      if (res.status !== 200) {
        console.error(res.status, res.statusText)

      } else {
        const result = await res.json()
        console.log('result:', result)
      }
    })()
  }
})
