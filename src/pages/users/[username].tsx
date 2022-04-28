import { useAppDispatch } from "@/app/hooks"
import { store } from "@/app/store"
import Layout from "@/components/layout/Layout"
import { User } from "@/components/model/basic"
import { } from "@/features/favorite/favoriteFunction"
import { GetUserDetail } from "@/features/user/userFunction"
import * as React from "react"
import { Provider } from "react-redux"

function UserDetail({ username, user, repositories, followers, followings }: any) {

  return (<Layout page={"user"}>
    <Provider store={store}>
      <GetUserDetail username={username} user={user} repositories={repositories} followers={followers} followings={followings}></GetUserDetail>
    </Provider>
  </Layout>
  )
}
UserDetail.getInitialProps = async (ctx: any) => {

  const { username } = ctx.query
  const user: User = await fetch('https://api.github.com/users/' + username, {
    headers: {
      'Accept': 'application/vnd.github.v3.text-match+json'
    }
  }).then((response: any) => response.json(
  )).then((results: any) => {
    return results
  })
  const repositories = await fetch("https://api.github.com/users/" + user.login + "/repos?&per_page=2&page=1", {
    headers: {
      'Accept': 'application/vnd.github.v3.text-match+json'
    }
  }).then((response: any) => response.json(
  )).then((results: any) => {
    return results
  })
  const followers = await fetch("https://api.github.com/users/" + user.login + "/followers?&per_page=2&page=1", {
    headers: {
      'Accept': 'application/vnd.github.v3.text-match+json'
    }
  }).then((response: any) => response.json(
  )).then((results: any) => {
    return results
  })
  const followings = await fetch("https://api.github.com/users/" + user.login + "/following?&per_page=2&page=1", {
    headers: {
      'Accept': 'application/vnd.github.v3.text-match+json'
    }
  }).then((response: any) => response.json(
  )).then((results: any) => {
    return results
  })
  return { username, user, repositories, followers, followings }
}
export default UserDetail