/* eslint-disable react/no-array-index-key */
/* eslint-disable no-use-before-define */
/* eslint-disable arrow-body-style */
/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import { Icon } from "@mui/material";
import moment from "moment";

import { deleteReq, get } from "../../services/request";
import apiLinks from "../../global/apiLinks";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

import booking1 from "../../assets/images/products/product-1-min.jpg";
import PostCard from "./components/PostCard";

function SelectedTopic({ topicId, setPostResumed, shouldUpdate = false, onEdit }) {
  const [postData, setPostData] = useState({
    currentPage: 0,
    hasNext: false,
    hasPrevious: false,
    posts: [],
    totalItems: 0,
    totalPages: 1,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [topicData, setTopicData] = useState({
    id: 0,
    title: "",
    post_count: 0,
  });

  const getPostsOfTopic = async (page = 0) => {
    try {
      const { data } = await get(apiLinks.loadPostsOfTopic(topicId, page));
      setPostData(data);
      const resume = {
        published: 0,
        draft: 0,
        trashed: 0,
      };
      data.posts.forEach((item) => {
        if (item.published) {
          resume.published += 1;
        }
        if (item.trashed) {
          resume.trashed += 1;
        }
        if (item.draft) {
          resume.draft += 1;
        }
      });
      setPostResumed(resume);
    } catch (error) {
      console.log(error);
    }
  };

  const getTopicData = async () => {
    try {
      const { data } = await get(`${apiLinks.loadTopicDetails}${topicId}`);
      setTopicData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTopicData();
    getPostsOfTopic();
  }, [shouldUpdate]);

  const deletePost = async (item) => {
    try {
      setIsDeleting(true);
      await deleteReq(`union/posts/delete/${item.id}`);
      getPostsOfTopic();
    } catch (error) {
      console.log(error);
    }
    setIsDeleting(false);
  };

  const postsButtons = (item) => (
    <>
      <Tooltip title="Delete The Post" placement="bottom">
        <MDTypography
          variant="body1"
          color="primary"
          lineHeight={1}
          sx={{ cursor: "pointer", mx: 3 }}
          onClick={() => deletePost(item)}
          disabled={isDeleting}
        >
          <Icon color="inherit">delete</Icon>
        </MDTypography>
      </Tooltip>
      <Tooltip title="Edit The Post" placement="bottom">
        <MDTypography
          variant="body1"
          color="info"
          lineHeight={1}
          sx={{ cursor: "pointer", mx: 3 }}
          onClick={() => onEdit(item)}
        >
          <Icon color="inherit">edit</Icon>
        </MDTypography>
      </Tooltip>
    </>
  );

  return (
    <div>
      <MDBox mb={2}>{topicData?.title}</MDBox>
      <Grid container spacing={6}>
        {postData.posts.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <MDBox mt={3}>
              <PostCard
                image={item.image?.link || booking1}
                title={item.title}
                description={item.text}
                time={moment(item.timePosted).fromNow()}
                location={item.unionProvider}
                action={postsButtons(item)}
              />
            </MDBox>
          </Grid>
        ))}

        {/* 
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mt={3}>
            <BookingCard
              image={booking1}
              title="Cozy 5 Stars Apartment"
              description='The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.'
              price="$899/night"
              location="Barcelona, Spain"
              action={postsButtons}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mt={3}>
            <BookingCard
              image={booking1}
              title="Cozy 5 Stars Apartment"
              description='The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.'
              price="$899/night"
              location="Barcelona, Spain"
              action={postsButtons}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mt={3}>
            <BookingCard
              image={booking1}
              title="Cozy 5 Stars Apartment"
              description='The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.'
              price="$899/night"
              location="Barcelona, Spain"
              action={postsButtons}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mt={3}>
            <BookingCard
              image={booking1}
              title="Cozy 5 Stars Apartment"
              description='The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.'
              price="$899/night"
              location="Barcelona, Spain"
              action={postsButtons}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mt={3}>
            <BookingCard
              image={booking1}
              title="Cozy 5 Stars Apartment"
              description='The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.'
              price="$899/night"
              location="Barcelona, Spain"
              action={postsButtons}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mt={3}>
            <BookingCard
              image={booking1}
              title="Cozy 5 Stars Apartment"
              description='The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.'
              price="$899/night"
              location="Barcelona, Spain"
              action={postsButtons}
            />
          </MDBox>
        </Grid>
          */}
      </Grid>
    </div>
  );
}

SelectedTopic.propTypes = {
  shouldUpdate: PropTypes.bool.isRequired,
  topicId: PropTypes.string.isRequired,
  setPostResumed: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default SelectedTopic;
