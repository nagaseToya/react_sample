import React from "react";
import "./App.css";
import def_logo from "./assets/def-user.jpeg";
import uni_logo from "./assets/uni_image.jpeg";
import react_logo from "./assets/react_logo.png";
import vue_logo from "./assets/Vue_logo.png";
import angular_logo from "./assets/angular_logo.png";
import html_logo from "./assets/html_logo.jpeg";
import css_logo from "./assets/css_logo.png";

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
    this.setState({ input_text: event.target.value });
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
        text: this.state.input_text,
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
    this.setState({ posts: posts_data });

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
          name: "リアク太郎",
          img: react_logo,
          prise_point: 100,
          got_point: 0,
        },
        {
          id: 2,
          name: "ビュー次郎",
          img: vue_logo,
          prise_point: 100,
          got_point: 0,
        },
        {
          id: 3,
          name: "アンギュラ子",
          img: angular_logo,
          prise_point: 100,
          got_point: 0,
        },
        {
          id: 4,
          name: "Hiroto TML",
          img: html_logo,
          prise_point: 100,
          got_point: 0,
        },
        {
          id: 5,
          name: "She SS",
          img: css_logo,
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
        <div key={post.date}>
          <img src={post.submit_user.img} />
          <div>{post.submit_user.name}</div>
          <img src={post.prised_user.img} />
          <div>{post.prised_user.name}</div>
          <p>{post.text}</p>
          <div>{post.liked_point}</div>
          <div>
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
                <div key={post.liked_user}>
                  {value.name} : {value.gave_point}
                </div>
              ))}
          </div>
          <i
            className="fas fa-hand-holding-heart"
            onClick={() => this.likePost(post)}
          ></i>
          <div>{post.date}</div>
        </div>
      ));

    // レンダリング
    return (
      <div className="App">
        <div className="header">
          <img src={this.state.current_user.img} />
          <div>
            <select name="current_user" onChange={this.cHandleChange}>
              <option>ーユーザーを選択して下さいー</option>
              {userList}
            </select>
          </div>
          <div>
            <div>
              <span>名前：</span>
              <span>{this.state.current_user.name}</span>
            </div>
            <span>拍手できる：</span>
            <span>{this.state.current_user.prise_point}</span>
            <span>拍手された：</span>
            <span>{this.state.current_user.got_point}</span>
          </div>
        </div>
        <div className="post">
          <img src={this.state.prised_user.img} />
          <div>
            <select name="prised_user" onChange={this.pHandleChange}>
              <option>ーユーザーを選択して下さいー</option>
              {userList}
            </select>
          </div>
          <div>
            <span>名前：</span>
            <span>{this.state.prised_user.name}</span>
          </div>
          <input
            onChange={this.inputOnChange}
            type="text"
            name="input"
            value={this.state.input_text}
            placeholder="あなたの仲間のステキな行動を褒めようぜ！"
          />
          <button onClick={this.postMessage}>褒める</button>
        </div>
        <div className="list">{post_item}</div>
      </div>
    );
  }
}

export default App;
