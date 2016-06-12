import sectionApi from './section'

export default async function populateIssue() {
  return await {
    considering: await sectionApi('considering'),
    limiting: await sectionApi('limiting')
  }
}
