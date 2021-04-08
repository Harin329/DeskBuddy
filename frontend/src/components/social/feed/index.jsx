import React from 'react';
import ReportIcon from './assets/report.svg';
import UnreportIcon from './assets/unreport.svg'
import Thrash from './assets/delete.svg';
import Endpoint from '../../../config/Constants';
import Spinner from '../../reservation/map-popup/spinner/spinner';
import { Modal } from '@material-ui/core';
import safeFetch, { accountIsAdmin } from "../../../util/Util";
import { MsalContext } from "@azure/msal-react";
import ErrorPopup from '../../global/error-popup/index'
import ICBC from "../../../assets/ICBC.png";

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
  PostingPopup,
  ReportPopup
} from './styles';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class Feed extends React.Component {
  static contextType = MsalContext;

  state = {
    post: '',
    loaded: false,
    error: false,
    flag_loaded: 1,
    post_loaded: 1,
    report_popup: false,
    reported_post: -1,
    curr_category: 0,
    unreported_popup: false,
    delete_popup: false,
    delete_post: null,
    error_popup: false,
  };

  constructor(props) {
    super(props);
    this.feed = [];
    this.channel_id = 1;
    this.init();
  }

  // Load list of posts to be rendered
  init = () => {
    this.setState({ loaded: false, error: false });

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    safeFetch(
      `${Endpoint}/post/getFeedByCategory/${this.channel_id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        this.feed = JSON.parse(result);
        this.setState({ loaded: true });
      })
      .catch((error) => this.setState({ loaded: true, error: true }));
  };

  // request to POST a post
  handlePost = (oid) => {
    this.setState({
      post_loaded: (this.state.post_loaded + 1) % 2,
    });
    setTimeout(() => {

      const jsonBody = {
        employee_id: oid,
        channel_id: this.channel_id,
        post_content: this.state.post,
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonBody),
        redirect: 'follow',
      };

      safeFetch(Endpoint + '/post/createPost', requestOptions)
        .then((response) => response.text())
        .then((result) => {
          // console.log(JSON.parse(result));
          this.init();
          this.setState({
            post_loaded: (this.state.post_loaded + 1) % 2,
            post: '',
          });
        })
        .catch((error) => {
          this.setState({
            post_loaded: (this.state.post_loaded + 1) % 2,
            post: '',
            error_popup: true,
          });
        });
    }, 1000);
  };

  // request to POST a report of a post 
  handleReport = (id) => {
    const raw = JSON.stringify({
      post_id: id,
    });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: raw,
      redirect: 'follow',
    };

    safeFetch(Endpoint + '/post/flagPost', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // console.log(JSON.parse(result));
        this.setState({
          flag_loaded: (this.state.flag_loaded + 1) % 2,
          report_popup: false,
          reported_post: -1,
        });
      })
      .catch((error) => {
        console.log('error', error);
        this.setState({ report_popup: false, reported_post: -1, error_popup: true,})
      });
  };

  // request to POST an unreport to a post
  handleUnreport = (id) => {
    const raw = JSON.stringify({
      post_id: id,
    });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: raw,
      redirect: 'follow',
    };

    safeFetch(Endpoint + '/post/unreportPost', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        this.setState({
          flag_loaded: (this.state.flag_loaded + 1) % 2,
          unreported_popup: false,
          reported_post: -1,
        });
        this.init();
      })
      .catch((error) => {
        console.log('error', error);
        this.setState({ unreported_popup: false, reported_post: -1, error_popup: true,})
      });
  };

  // handle change in textarea of post
  handleChange = (arg) => {
    this.setState({ post: arg.target.value.substr(0, 240) });
  };

  // request to DELETE a post
  handleDelete = (el) => {
    const raw = JSON.stringify({
      post_id: el.post_id,
    });

    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: raw,
      redirect: 'follow',
    };

    safeFetch(Endpoint + '/post/deletePost', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        this.feed.splice(this.feed.indexOf(el), 1);
        this.setState({
          delete_popup: false,
          delete_post: null,
        });
      })
      .catch((error) => {
        console.log('error', error);
        this.setState({
          delete_popup: false,
          delete_post: null,
          error_popup: true
        });
      });
  };

  // handle which channel the social feed is currently displaying posts from
  handleChannelChange = (channel_id) => {
    this.channel_id = channel_id;
    this.init();
    this.setState({ flag_load: (this.state.flag_loaded + 1) % 2 });
  };

  handleOpenReport = (oid) => {
    this.setState({ report_popup: true, reported_post: oid });
  }

  handleOpenUnreport = (oid) => {
    this.setState({ unreported_popup: true, reported_post: oid });
  }

  handleOpenDelete = (el) => {
    this.setState({ delete_popup: true, delete_post: el });
  }

  render() {
    const isAdmin = accountIsAdmin(this.context.accounts[0]);
    const oid = this.context.accounts[0].idTokenClaims.oid;

    let list_of_feed = Spinner();

    if (this.state.loaded && !this.state.error && Array.isArray(this.feed)) {
      list_of_feed = this.feed.map((el) => {
        return (
          <SinglePostContainer key={el.post_id}>
            <UserContainer>
              <UserPic
                src={
                  el.profile_photo != null ? 'data:image/png;base64,' + new Buffer(el.profile_photo, 'binary').toString('base64') : ICBC
                }
                alt="profie pic"
              />
              {`${el.first_name} ${el.last_name} | `}
              <DatePostedContainer>
                {`${MONTHS[Number(el.date_posted.slice(5, 7)) - 1]} ${el.date_posted.slice(8,10)}, ${el.date_posted.slice(0,4)}`}
              </DatePostedContainer>
            </UserContainer>
            <TextContainer>{el.post_content}</TextContainer>
            <ButtonContainers>
              <Icon
                src={this.channel_id !== 0 ? ReportIcon : UnreportIcon}
                onClick={() => {
                  if (this.channel_id !== 0)
                    this.handleOpenReport(el.post_id);
                  else if (this.channel_id === 0)
                    this.handleOpenUnreport(el.post_id);
                }}
              />
              {el.employee_id === oid || isAdmin ? (
                <Icon src={Thrash} onClick={() => this.handleOpenDelete(el)} />
              ) : null}
            </ButtonContainers>
          </SinglePostContainer>
        );
      });
    } else if (this.state.error) {
      list_of_feed = (
        <div style={{ color: 'white' }}>
          Error loading feed. Try again later.
        </div>
      );
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

    let reportPopup = (
      <Modal
        open={this.state.report_popup}
        onClose={() =>
          this.setState({ report_popup: false, reported_post: -1 })
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ReportPopup>
          <div>Are you sure you want to report this post?</div>
          <Btn
            type="button"
            value="Yes"
            onClick={() => this.handleReport(this.state.reported_post)}
          />
        </ReportPopup>
      </Modal>
    );

    let unreportPopup = (
      <Modal
        open={this.state.unreported_popup}
        onClose={() =>
          this.setState({ unreported_popup: false, reported_post: -1 })
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ReportPopup>
          <div>Are you sure you want to unreport this post?</div>
          <Btn
            type="button"
            value="Yes"
            onClick={() => this.handleUnreport(this.state.reported_post)}
          />
        </ReportPopup>
      </Modal>
    );

    let deletePopup = (
      <Modal
        open={this.state.delete_popup}
        onClose={() =>
          this.setState({ delete_popup: false, delete_post: null })
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ReportPopup>
          <div>Are you sure you want to delete this post? You cannot undo this action.</div>
          <Btn
            type="button"
            value="Yes"
            onClick={() => this.handleDelete(this.state.delete_post)}
          />
        </ReportPopup>
      </Modal>
    );

    let errorPopup = (
      <Modal
        open={this.state.error_popup}
        onClose={() =>
          this.setState({ error_popup: false})
        }
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ErrorPopup />
      </Modal>
    );

    return (
      <Container>
        {isPosting}
        {reportPopup}
        {unreportPopup}
        {deletePopup}
        {errorPopup}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SocialFeed>
            { this.channel_id !== 0 ?
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
                      onClick={() => this.handlePost(oid)}
                      disabled={this.state.post === '' ? true : false}
                    />
                    <div
                      style={{ color: 'white', height: '8px' }}
                    >{`${this.state.post.length}/240`}</div>
                  </div>
                </ShareForm>
              </ShareContainer> : null
            }
            <PostsContainer>{list_of_feed}</PostsContainer>
          </SocialFeed>
        </div>
      </Container>
    );
  }
}

export default Feed;