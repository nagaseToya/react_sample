import React from "react";
import "./App.css";
import def_logo from "./assets/def-user.jpeg";
import uni_logo from "./assets/uni_image.jpeg";
import anemo_logo from "./assets/anemo.jpeg";
import hime_logo from "./assets/hime.jpeg";
import hotal_logo from "./assets/hotal.jpeg";
import judge_logo from "./assets/judge-man.jpeg";
import kurage_logo from "./assets/kurage.jpeg";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_user: {
        id: -1,
        name: "ユーザーを選択して下さい",
        img: def_logo,
        prise_point: 100,
        got_point: 0,
      },
      prised_user: {
        id: -2,
        name: "ユーザーを選択して下さい",
        img: def_logo,
        prise_point: 100,
        got_point: 0,
      },
      users: [],
      input_text: "",
      output_text: "",
      posts: [],
    };
    this.cHandleChange = this.cHandleChange.bind(this);
    this.pHandleChange = this.pHandleChange.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.likePost = this.likePost.bind(this);
  }
  //関数
  // 現在ユーザーの選択
  cHandleChange = (event) => {
    for (let i = 0; i < this.state.users.length; i++) {
      if (event.target.value === this.state.users[i].name) {
        if (
          this.state.users[i].id === this.state.prised_user.id ||
          this.state.users[i].id === this.state.current_user.id
        ) {
          alert("褒める人と褒められる人は違う人にして下さい☺️");
        } else {
          this.setState({ current_user: this.state.users[i] });
        }
      }
    }
  };
  // 褒めるユーザーの選択
  pHandleChange = (event) => {
    for (let i = 0; i < this.state.users.length; i++) {
      if (event.target.value === this.state.users[i].name) {
        if (
          this.state.users[i].id === this.state.prised_user.id ||
          this.state.users[i].id === this.state.current_user.id
        ) {
          alert("褒める人と褒められる人は違う人にして下さい☺️");
        } else {
          this.setState({ prised_user: this.state.users[i] });
        }
      }
    }
  };
  // 投稿フォームに文字が入力された時の処理
  inputOnChange = (event) => {
    this.setState({
      output_text: event.target.value.replace(/\r?\n/g, "<br>"),
      input_text: event.target.value,
    });
  };
  // 投稿ボタンを押した時の処理
  postMessage = () => {
    // 投稿の条件を満たしているか確認
    if (!this.checkPost()) {
      return;
    } else {
      // 投稿内容を作成し、保存
      let post = {
        id: this.state.posts.length,
        text: this.state.output_text,
        date: this.dateFormat(new Date(), "YYYY/MM/DD hh:mm:ss"),
        submit_user: this.state.current_user,
        prised_user: this.state.prised_user,
        liked_point: 0,
        liked_user: [],
      };
      this.state.posts.push(post);
      this.setState({ posts: this.state.posts });
      localStorage["posts"] = JSON.stringify(this.state.posts);
      // 初期化
      this.setState({ input_text: "" });
      this.setState({
        prised_user: {
          id: -2,
          name: "ユーザーを選択して下さい",
          img: def_logo,
          prise_point: 100,
          got_point: 0,
        },
      });
    }
  };
  // 投稿する際に条件を満たしているかチェックする関数
  checkPost = () => {
    let result = true;
    // ５文字以上フォームに入力されているか
    if (this.state.input_text.length < 5) {
      result = false;
      alert(`もっとたくさん褒めて下さい！\n(最低５文字は入力して下さい）`);
      return result;
    }
    // ユーザーの選択がされているか
    if (this.state.current_user.id === -1 || this.state.prised_user.id === -2) {
      result = false;
      alert("ユーザーを選択して下さい");
      return result;
    }
    return result;
  };
  // 日付のフォーマット指定
  dateFormat = (date, format) => {
    if (!format) {
      format = "YYYY/MM/DD hh:mm:ss";
    }

    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ("0" + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ("0" + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ("0" + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ("0" + date.getSeconds()).slice(-2));

    return format;
  };
  // 投稿へのいいね処理
  likePost = (post) => {
    if (!this.checkLikeAction(post)) {
      return;
    } else {
      let posts = this.state.posts.sort(function (a, b) {
        if (a.id < b.id) {
          return -1;
        } else {
          return 1;
        }
      });
      let users = this.state.users;
      // posts
      // いいねしたユーザーの情報を保存
      let like_actioned_user = {
        id: this.state.current_user.id,
        name: this.state.current_user.name,
        gave_point: 1,
      };
      if (post.liked_user.length === 0) {
        posts[post.id].liked_user.push(like_actioned_user);
        this.setState({ posts: posts });
      } else {
        let x = true;
        for (let i = 0; i < post.liked_user.length; i++) {
          if (posts[post.id].liked_user[i].id === this.state.current_user.id) {
            posts[post.id].liked_user[i].gave_point =
              posts[post.id].liked_user[i].gave_point + 1;

            x = !x;
          }
        }
        if (x) {
          posts[post.id].liked_user.push(like_actioned_user);
        }
        this.setState({ posts: posts });
      }
      //いいねされた回数をカウント
      posts[post.id].liked_point = posts[post.id].liked_point + 1;
      // posts 情報を state , localstrage に保存
      this.setState({ posts: posts });
      localStorage["posts"] = JSON.stringify(posts);

      // users
      // submit_user
      users[post.submit_user.id].got_point =
        users[post.submit_user.id].got_point + 1;
      // prised_user
      users[post.prised_user.id].got_point =
        users[post.prised_user.id].got_point + 1;
      // いいね押した人
      users[this.state.current_user.id].prise_point =
        users[this.state.current_user.id].prise_point - 2;
      // users 情報を state , localstrage に保存
      this.setState({ users: users });
      localStorage["users"] = JSON.stringify(users);
    }
  };
  // いいねする際に条件を満たしているかチェックする関数
  checkLikeAction = (post) => {
    let result = true;
    let posts = this.state.posts.sort(function (a, b) {
      if (a.id < b.id) {
        return -1;
      } else {
        return 1;
      }
    });
    let users = this.state.users;
    // その投稿をした人と、褒められた人が現在のユーザーか確認
    if (
      this.state.current_user.id === post.submit_user.id ||
      this.state.current_user.id === post.prised_user.id ||
      this.state.current_user.id === -1 ||
      this.state.current_user.prise_point <= 0
    ) {
      result = false;
      return result;
    }
    // 一つの投稿に最大15回までしかいいねできないので、一人一人のいいねした回数をチェック
    for (let i = 0; i < post.liked_user.length; i++) {
      if (
        posts[post.id].liked_user[i].id === this.state.current_user.id &&
        15 <= posts[post.id].liked_user[i].gave_point
      ) {
        result = false;
        return result;
      }
    }
    return result;
  };

  componentDidMount() {
    // localstrage の読み込み
    let posts_data = JSON.parse(localStorage["posts"] || "[]");
    let posts = [];
    for (let i = 0; i < posts_data.length; i++) {
      const post = {
        date: posts_data[i].date,
        id: posts_data[i].id,
        liked_point: posts_data[i].liked_point,
        liked_user: posts_data[i].liked_user,
        prised_user: posts_data[i].prised_user,
        submit_user: posts_data[i].submit_user,
        text: posts_data[i].text.replace(/<br>/g, "\n"),
      };
      posts.push(post);
    }
    this.setState({ posts: posts });

    let users_data = JSON.parse(localStorage["users"] || "[]");
    this.setState({ users: users_data });

    // 初回起動時に localstrage にユーザー情報を保存
    if (users_data.length === 0) {
      users_data = [
        {
          id: 0,
          name: "Uni",
          img: uni_logo,
          prise_point: 100,
          got_point: 0,
        },
        {
          id: 1,
          name: "ヒメ",
          img: hime_logo,
          prise_point: 100,
          got_point: 0,
        },
        {
          id: 2,
          name: "ホタル",
          img: hotal_logo,
          prise_point: 100,
          got_point: 0,
        },
        {
          id: 3,
          name: "ジャッジくん",
          img: judge_logo,
          prise_point: 100,
          got_point: 0,
        },
        {
          id: 4,
          name: "くらげ",
          img: kurage_logo,
          prise_point: 100,
          got_point: 0,
        },
        {
          id: 5,
          name: "あねも",
          img: anemo_logo,
          prise_point: 100,
          got_point: 0,
        },
      ];
      localStorage["users"] = JSON.stringify(users_data);
      this.setState({ users: users_data });
    }
  }

  render() {
    // コンポーネント
    const userList = this.state.users.map((user, index) => (
      <option key={index}>{user.name}</option>
    ));

    const post_item = this.state.posts
      .sort(function (a, b) {
        if (a.id > b.id) {
          return -1;
        } else {
          return 1;
        }
      })
      .map((post) => (
        <div className="card" key={post.date}>
          <img className="post-sub-img" src={post.submit_user.img} />
          <span className="post-sub-name">{post.submit_user.name}</span>
          <span className="post-date">{post.date}</span>
          <img className="post-pri-img" src={post.prised_user.img} />
          <div className="post-pri-name">{post.prised_user.name}</div>
          <div className="text-cover">
            <textarea
              className="post-text"
              value={post.text.replace(/<br>/g, "\n")}
            />
          </div>
          <i className="direction fas fa-angle-double-right"></i>
          <div className="liked-container">
            <div className="like-count">{post.liked_point}</div>
            <div className="liked-user-list">
              <div>拍手一覧</div>
              {post.liked_user
                .sort(function (a, b) {
                  if (a.gave_point > b.gave_point) {
                    return -1;
                  } else {
                    return 1;
                  }
                })
                .map((value) => (
                  <div key={post.id}>
                    {value.name} : {value.gave_point}
                  </div>
                ))}
            </div>
          </div>
          <i
            className="like-icon fas fa-hand-holding-heart"
            onClick={() => this.likePost(post)}
          ></i>
        </div>
      ));

    // レンダリング
    return (
      <div className="App">
        <div className="app-background"></div>
        <div className="app-container">
          <div className="header">
            <span className="c-img-holder">
              <img className="c-user-img" src={this.state.current_user.img} />
              <div>
                <select name="current_user" onChange={this.cHandleChange}>
                  <option>ログインユーザー選択</option>
                  {userList}
                </select>
              </div>
            </span>
            <span className="c-user-details">
              <div>
                <div className="c-name-t color-font">user name</div>
                <span className="c-name">{this.state.current_user.name}</span>
              </div>
              <span>
                <div className="c-name-t color-font">拍手できる数</div>
                <span className="c-name">
                  {this.state.current_user.prise_point}
                </span>
              </span>
              <span>
                <div className="c-name-t color-font">拍手された数</div>
                <span className="c-name">
                  {this.state.current_user.got_point}
                </span>
              </span>
            </span>
          </div>
          <div className="post">
            <div className="inner">
              <div className="p-img-holder">
                <img className="p-user-img" src={this.state.prised_user.img} />
                <div>
                  <select
                    value={this.state.prised_user.name}
                    name="prised_user"
                    onChange={this.pHandleChange}
                  >
                    <option>褒める人を選択</option>
                    {userList}
                  </select>
                </div>
              </div>
              <textarea
                className="textlines"
                onChange={this.inputOnChange}
                type="text"
                name="input"
                value={this.state.input_text}
                placeholder="あなたの仲間のステキな行動を褒めようぜ！"
              />
              <div className="post-button" onClick={this.postMessage}>
                褒める
              </div>
            </div>
          </div>
          <div className="list">{post_item}</div>
        </div>
      </div>
    );
  }
}

export default App;
