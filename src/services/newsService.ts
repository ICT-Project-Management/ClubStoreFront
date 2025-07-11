// src/services/newsService.ts
import { newsRepository } from '../repositories/newsRepository'

export const newsService = {
  async fetchAllNews(filters: { title?: string; page?: number } = {}) {
    const res = await newsRepository.getAll(filters)
    return res.data
  },

  async fetchNewsById(id: number) {
    const res = await newsRepository.getById(id)
    return res.data
  },

  async fetchNewNews() {
    const res = await newsRepository.getNewNews()
    return res.data
  },

  async fetchNewsOnWeek() {
    const res = await newsRepository.getNewsOnWeek()
    return res.data
  },

  async addNews(data: any) {
    const res = await newsRepository.store(data)
    return res.data
  },

  async deleteNews(id: number) {
    const res = await newsRepository.delete(id)
    return res.data
  }
}
