
import Component from './Component'
import Base from './Base'
import View500 from '../views/500'

import Breadcrumbs from './Breadcrumbs'
import MobBack from './MobBack'
import Loading from './Loading'
import MobLoading from './MobLoading'
import VotePK from './VotePk'
import VoteSelect from './VoteSelect'
import VoteComment from './VoteComment'
import PaginateLite from './PaginateLite'
import PublishComment from './PublishComment'
import Comment from './Comment'
import TopicFavor from './TopicFavor'
import TopicAvatar from './TopicAvatar'
import MobShare from './MobShare'
import PostItem from './PostItem'

const componentDefs = [
  Component,
  Base,
  View500,
  Breadcrumbs,
  Breadcrumbs,
  MobBack,
  Loading,
  MobLoading,
  VotePK,
  VoteSelect,
  VoteComment,
  PaginateLite,
  PublishComment,
  Comment,
  TopicFavor,
  TopicAvatar,
  MobShare,
  PostItem
]

const install = function (Vue, options) {
  if (install.installed) return

  for (const oComDef of componentDefs) {
    Vue.component(oComDef.name, oComDef)
  }

  install.installed = true
}

export default {
  install,
  Component,
  Base,
  Breadcrumbs,
  MobBack,
  Loading,
  MobLoading,
  VotePK,
  VoteSelect,
  VoteComment,
  PaginateLite,
  PublishComment,
  Comment,
  TopicFavor,
  TopicAvatar,
  MobShare,
  PostItem
}
