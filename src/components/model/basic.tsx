export interface User {
  login: string,
  id: number,
  name: string,
  avatar_url: string,
  company: string,
  url: string,
  followers: number,
  following: number,
  public_repos: number,
  isFavorite: boolean,
  followers_url: string,
  following_url: string,
  repos_url: string,
  text_matches: text_match[]
}

export interface text_match {
  object_url: string,
  object_type: string,
  property: string,
  fragment: string,
}

export interface notFound {
  inputValue: string,
  show: boolean
}

export interface repositorie {
  name: string,
  stargazers_count: number,
  forks_count: number
}