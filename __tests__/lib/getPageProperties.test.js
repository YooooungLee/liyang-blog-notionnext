import getPageProperties from '@/lib/db/notion/getPageProperties'

jest.mock('notion-utils', () => ({
  getDateValue: value => (value?.[0]?.[0] === 'd' ? value[0][1] : null),
  getTextContent: value =>
    Array.isArray(value) ? value.map(item => item?.[0] || '').join('') : value
}))

jest.mock('@/lib/db/notion/getNotionAPI', () => ({
  __esModule: true,
  default: { getUsers: jest.fn() }
}))

describe('getPageProperties', () => {
  it('ignores an empty Notion date cell instead of aborting the database', async () => {
    const createdTime = Date.UTC(2026, 0, 2)
    const value = {
      created_time: createdTime,
      last_edited_time: createdTime,
      properties: {
        title: [['Untitled']],
        date: []
      }
    }
    const schema = {
      title: { name: 'title', type: 'title' },
      date: { name: 'date', type: 'date' }
    }

    await expect(
      getPageProperties('page-id', value, schema, null, [])
    ).resolves.toMatchObject({
      title: 'Untitled',
      publishDate: createdTime
    })
  })
})
