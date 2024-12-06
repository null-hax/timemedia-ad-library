export type Database = {
  public: {
    tables: {
      mentions: {
        Row: {
          id: number
          newsletter_name: string
          date: string
          company_name: string
          category: string
          link: string
          description: string
          read_more_link: string
          ad_copy: string | null
          created_at?: string
        }
      }
    }
  }
} 