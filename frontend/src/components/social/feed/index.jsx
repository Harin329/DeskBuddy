import React from 'react';
import { subtitle } from '../../global/subtitle-line/index';
import JonSnow from './assets/jonsnow_pic.png';
import Redflag from './assets/redflag.svg';
import Flag from './assets/flag.svg';
import Thrash from './assets/delete.svg';
import Endpoint from '../../../config/Constants';
import Spinner from '../../reservation/map-popup/spinner/spinner';
import { Modal } from '@material-ui/core';

// styles
import {
  Container,
  SocialFeed,
  ShareContainer,
  PostsContainer,

  ShareForm,
  ShareTextArea,
  Btn,

  SinglePostContainer,
  UserContainer,
  UserPic,
  TextContainer,
  ButtonContainers,
  DatePostedContainer,
  Icon,
  PostingPopup
} from './styles';

class Feed extends React.Component {
  state = {
    post: '',
    loaded: false,
    error: false,
    flag_loaded: 1,
    post_loaded: 1,
    post_error: false,
    channel_id: 0
  };

  constructor(props) {
    super(props);
    this.feed = null;
    this.init(0);
    this.CURR_EMPLOYEE_ID = '99b9a9cf-1cb0-40c3-87c0-aa98d6ce68d1';
  }

  init = () => {
    this.setState({ loaded: false, error: false });

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${Endpoint}/post/getFeedByCategory/${this.state.channel_id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        // console.log(JSON.parse(result));
        this.feed = JSON.parse(result);
        this.setState({ loaded: true });
      })
      .catch((error) => this.setState({ loaded: true, error: true }));
  };

  handlePost = () => {
    // console.log(`Post the following: ${this.state.post}`);
    this.setState({ post_error: false, post_loaded: (this.state.post_loaded + 1) % 2 });
    setTimeout(() => {

      let date = new Date();

      const jsonBody = {
        employee_id: this.CURR_EMPLOYEE_ID,
        channel_id: this.state.channel_id,
        date_posted: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        post_content: this.state.post,
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonBody),
        redirect: 'follow',
      };

      fetch(Endpoint + "/post/createPost", requestOptions)
        .then((response) => response.text())
        .then(result => {
          // console.log(JSON.parse(result));
          this.init(0);
          this.setState({
            post_loaded: (this.state.post_loaded + 1) % 2,
            post: ''
          });
        })
        .catch(error => {
          this.setState({
            post_loaded: (this.state.post_loaded + 1) % 2,
            post_error: true,
            post: '',
          });
        });
    }, 1000);
  };

  handleFlag = (el) => {
    // console.log(`Flaggin post with id: ${el.employee_id} which is flagged or not: ${el.is_flagged}`);
    const raw = JSON.stringify(
      {
        post_id: el.post_id,
        flag_val: !el.is_flagged,
      }
    )

    const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: raw,
    redirect: 'follow',
    };

    fetch(Endpoint + "/post/flagPost", requestOptions)
      .then((response) => response.text())
      .then(result => {
        console.log(JSON.parse(result));
        el.is_flagged = !el.is_flagged;
        this.setState({ flag_loaded: (this.state.flag_loaded + 1) % 2 });

      })
      .catch(error => console.log('error', error));
  };

  handleChange = (arg) => {
    this.setState({ post: arg.target.value.substr(0, 240) });
  };

  handleDelete = (el) => {
    const raw = JSON.stringify({
      post_id: el.post_id
    });

    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: raw,
      redirect: 'follow',
    };

    fetch(Endpoint + '/post/deletePost', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        this.feed.splice(this.feed.indexOf(el), 1);
        this.setState({ flag_loaded: (this.state.flag_loaded + 1) % 2 });
      })
      .catch((error) => console.log('error', error));
  }


  render() {
    let list_of_feed = <Spinner />;

    if (this.state.loaded && !this.state.error && Array.isArray(this.feed)) {
      list_of_feed = this.feed.reverse().map((el) => {
        return (
          <SinglePostContainer key={el.post_id}>
            <UserContainer>
              <UserPic src={JonSnow} alt="profie pic" />
              {`${el.employee_id} | `}
              <DatePostedContainer>{el.date_posted.slice(0, 10)}</DatePostedContainer>
            </UserContainer>
            <TextContainer>{el.post_content}</TextContainer>
            <ButtonContainers>
              <Icon
                src={el.is_flagged ? Redflag : Flag}
                onClick={() => this.handleFlag(el)}
              />
              {el.employee_id === this.CURR_EMPLOYEE_ID ? <Icon src={Thrash} onClick={ () => this.handleDelete(el)}/> : null}
            </ButtonContainers>
          </SinglePostContainer>
        );
      });
    } else if (this.state.error) {
      list_of_feed = <div>Error loading feed. Try again later.</div>
    }

    let isPosting = null;
    if (!this.state.post_loaded) {
      isPosting = (
        <Modal
          open={!this.state.post_loaded}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PostingPopup>Posting...</PostingPopup>
        </Modal>
      );
    }

    return (
      <Container>
        {isPosting}
        {subtitle('FEED')}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SocialFeed>
            <ShareContainer>
              <ShareForm>
                <ShareTextArea
                  placeholder="Share something!"
                  onChange={(e) => this.handleChange(e)}
                  value={this.state.post}
                  maxLength="240"
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Btn
                    type="button"
                    value="Post"
                    onClick={this.handlePost}
                    disabled={this.state.post === '' ? true : false}
                  />
                  <div
                    style={{ color: 'white', height: '8px' }}
                  >{`${this.state.post.length}/240`}</div>
                </div>
              </ShareForm>
            </ShareContainer>
            <PostsContainer>{list_of_feed}</PostsContainer>
          </SocialFeed>
        </div>
      </Container>
    );
  }
}

export default Feed;