import {
  post,
  get,
  deleteReq,
  put,
  postBasicAuth,
  patch,
  postUploadImage,
} from "./request";

//this api call is for login user
export const loginApi = async (data) => {
  return postBasicAuth("auth/login", data);
};

//this api call is for Topic
export const getAllTopics = () => {
  return get("forum/all/topics?page=0&size=100");
};

//this api call is for Post
export const getAllPosts = (page, rowsPerPage, type) => {
  return get("forum/get/all/posts?page=" + page + "&size=" + rowsPerPage + "&postType=" + type);
};

//this api call is for Party
export const uploadImage = async (image, postId) => {
  return postUploadImage("forum/add/image/post/" + postId, image);
};

//this api call is for Party
export const createPosts = async (postData, topicId) => {
  return post("forum/createPost/" + topicId, postData);
};

//this api call is for Topic
export const createTopics = async (topicData) => {
  return post("forum/createTopic", topicData);
};
//transh post
export const transhPostData = async (postId) => {
  return post(`forum/trashed/${postId}`);
};
//delete post
export const deetePostData = async (postId, topicId) => {
  return deleteReq(`forum/deletePost/${topicId}/${postId}`);
};
//update post
export const updatePost = async (postData, postId) => {
  return post(`forum/updatePost/${postId}`, postData);
};

//get post count
export const getPostCount = async () => {
  return get(`forum/get/post/counter`);
};

//get post from topic id
export const getPostbyTopic = async (id) => {
  return get(`forum/all/posts/topic/${id}`);
};

//this api call is for Benefit
export const createBenefit = async (benefitFormData) => {
  return post("union/benefit/create", benefitFormData);
};

//this api call is for Benefit
export const getBenefitData = async () => {
  return get("union/benefit/all");
};

//this api call is for delete Benefit
export const deleteBenefit = async (id) => {
  return deleteReq(`union/benefit/delete/${id}`);
};

//update post
export const updateBenefit = async (benefitData, benefitId) => {
  return post(`union/benefit/update/${benefitId}`, benefitData);
};

//this api call is for Benefit
export const createMembers = async (membersFormData) => {
  return post("union/member/create", membersFormData);
};

//this api call is for members
export const getMembersData = async () => {
  return get("union/member/all");
};

//this api call is for delete members
export const deleteMembers = async (id) => {
  return deleteReq(`union/member/delete/${id}`);
};

//update post
export const updateMembers = async (membersData, membersId) => {
  return post(`union/member/update/${membersId}`, membersData);
};

