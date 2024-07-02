import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { IGetmoviesResult, IGetGeneresResult, getGenres } from "../api";
import { makeImagePath } from "../utils";
import YouTube from "react-youtube";

const SearchBox = styled.div`
  max-width: 1500px;
  padding: 80px;
  padding-bottom: 10px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentSection = styled.div`
  display: flex;
  width: 100%;
  img {
    margin-right: 20px;
    width: 800px;
  }
`;

const ContentInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
`;

const SearchTitle = styled.div`
  font-size: 42px;
  background-color: ${(props) => props.theme.red};
  border-radius: 10px;
`;

const SearchOverview = styled.p`
  font-size: 18px;
  margin: 10px 0;
  margin-bottom: 32px;
  padding: 18px 0;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
`;

const SearchDate = styled.div`
  font-size: 18px;
  span {
    display: inline-block;
    width: 100px;
    text-align: center;
    background-color: #ffa300;
    color: ${(props) => props.theme.black.darker};
    border-radius: 14px 0 0 0;
    margin-right: 8px;
    padding: 8px;
  }
`;

const SearchValue = styled.div`
  font-size: 18px;
  margin: 10px 0;
  span {
    display: inline-block;
    width: 100px;
    text-align: center;
    background-color: #ffa300;
    color: ${(props) => props.theme.black.darker};
    border-radius: 14px 0 0 0;
    margin-right: 8px;
    padding: 8px;
  }
`;

const SearchPoint = styled.div`
  font-size: 18px;
  margin: 10px 0;
  span {
    display: inline-block;
    width: 100px;
    text-align: center;
    background-color: #ffa300;
    color: ${(props) => props.theme.black.darker};
    border-radius: 14px 0 0 0;
    margin-right: 8px;
    padding: 8px;
  }
`;

const SearchGeneres = styled.div`
  font-size: 18px;
  span {
    display: inline-block;
    width: 100px;
    text-align: center;
    background-color: #ffa300;
    color: ${(props) => props.theme.black.darker};
    border-radius: 14px 0 0 0;
    margin-right: 8px;
    padding: 8px;
  }
`;

const ReviewSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  color: ${(props) => props.theme.black.darker};
  border-radius: 10px;
  p {
    width: 100%;
    margin: 0;
    padding: 10px;
    div {
      width: 100%;
    }
  }
`;

const ReviewTitle = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.red};
`;

const RecommenSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 1500px;
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  color: ${(props) => props.theme.black.darker};
  border-radius: 10px;
  h3 {
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => props.theme.red};
  }
  div {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 10px;
    font-size: 18px;
  }
`;

const Button = styled.button`
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  font-size: 18px;
  border: none;
  background: #fff;
  color: #000;
  &:active {
    background: ${(props) => props.theme.red};
    color: #fff;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
`;

const Search = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  // 리뷰와 추천을 토글할 상태 변수 정의
  const [showReviews, setShowReviews] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const API_KEY = "0bc8bd2db453d7413d1c2844ec617b61";
  const BASE_PATH = "https://api.themoviedb.org/3";

  const searchedMovies = () => {
    return fetch(
      `${BASE_PATH}/search/multi?query=${keyword}&api_key=${API_KEY}&language=ko-kr&page=1`
    ).then((response) => response.json());
  };

  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetmoviesResult>(["movies", keyword], searchedMovies);

  const { data: genereData, isLoading: genereLoading } =
    useQuery<IGetGeneresResult>(["getGeneres"], getGenres);

  type Review = {
    author: string;
    content: string;
    title: string;
    backdrop_path: string;
  };

  type ContentsState<T> = {
    [key: number]: T[];
  };

  // type ReviewsState = {
  //   [key: number]: string[];
  // };

  const [reviews, setReviews] = useState<ContentsState<Review>>({});

  const fetchReviews = (movieId: number) => {
    return fetch(
      `${BASE_PATH}/movie/${movieId}/reviews?language=en-US&page=1&api_key=${API_KEY}`
    ).then((response) => response.json());
  };

  useEffect(() => {
    if (movieData) {
      movieData.results.forEach((movie) => {
        fetchReviews(movie.id).then((reviewData) =>
          setReviews((prev) => ({
            ...prev,
            [movie.id]: reviewData?.results?.map((review: any) => ({
              author: review.author,
              content: review.content,
            })),
          }))
        );
      });
    }
  }, [movieData]);

  const [videos, setVideos] = useState<ContentsState<string>>({});

  const fetchVideos = (movieId: number) => {
    return fetch(
      `${BASE_PATH}/movie/${movieId}/videos?&language=en&US&page=1&api_key=${API_KEY}`
    ).then((response) => response.json());
  };

  useEffect(() => {
    if (movieData) {
      movieData.results.forEach((movie) => {
        fetchVideos(movie.id).then((videoData) => {
          const videoIds = videoData?.results?.map((video: any) => video.key);
          setVideos((prev) => ({
            ...prev,
            [movie.id]: videoIds,
          }));
        });
      });
    }
  }, [movieData]);

  const [recom, setRecom] = useState<ContentsState<Review>>({});

  const RecomVideos = (movieId: number) => {
    return fetch(
      `${BASE_PATH}/movie/${movieId}/recommendations?&language=ko&US&page=1&api_key=${API_KEY}`
    ).then((response) => response.json());
  };

  useEffect(() => {
    if (movieData) {
      movieData.results.forEach((movie) => {
        RecomVideos(movie.id).then((recomData) =>
          setRecom((prev) => ({
            ...prev,
            [movie.id]: recomData?.results?.map((recom: any) => ({
              title: recom.title,
              backdrop_path: recom.backdrop_path,
            })),
          }))
        );
      });
    }
  }, [movieData]);

  console.log(recom);
  return (
    <div>
      {movieLoading && genereLoading ? (
        <div>Loading...</div>
      ) : (
        movieData?.results.map((movie, index) => (
          <SearchBox key={index}>
            <ContentSection>
              <img src={makeImagePath(movie?.backdrop_path)} />
              <ContentInfo>
                <div>
                  <SearchTitle>
                    {movie?.title} {movie?.name}
                  </SearchTitle>
                  <SearchOverview>{movie?.overview}</SearchOverview>
                  <SearchDate>
                    <span>릴리즈</span>
                    {movie?.release_date}
                    {movie?.first_air_date}
                  </SearchDate>
                  <SearchValue>
                    <span>관람등급</span>
                    {movie?.adult ? "청소년관람불가" : "전체관람가"}
                  </SearchValue>
                  <SearchPoint>
                    <span>영화평점</span>
                    {movie?.vote_average !== undefined
                      ? movie?.vote_average.toFixed(2)
                      : "N/A"}
                    {movie?.vote_count
                      ? movie?.vote_count.toLocaleString("ko-kr")
                      : "0"}
                    명 투표참여
                  </SearchPoint>
                  <SearchGeneres>
                    <span>장르</span>
                    {movie?.genre_ids
                      ? movie?.genre_ids
                          .map(
                            (id) =>
                              genereData?.genres.find((item) => item.id === id)
                                ?.name
                          )
                          .filter((name) => name)
                          .join(", ")
                      : "N/A"}
                  </SearchGeneres>
                </div>
              </ContentInfo>
            </ContentSection>
            <ButtonSection>
              <Button
                onClick={() => {
                  setShowReviews(!showReviews);
                  setShowRecommendations(false);
                }}
              >
                Review
              </Button>
              <Button
                onClick={() => {
                  setShowRecommendations(!showRecommendations);
                  setShowReviews(false);
                }}
              >
                Recommen
              </Button>
            </ButtonSection>

            {showReviews && (
              // showReviews 상태 변수가 true인 경우 리뷰를 렌더링
              <ReviewSection>
                <h3>😘 Reviews 😘</h3>
                {reviews[movie.id]?.length > 0 ? (
                  reviews[movie.id].map((review, reviewIndex) => (
                    <p key={reviewIndex}>
                      <div>
                        <ReviewTitle>🥸 {review.author}</ReviewTitle>
                        {review.content}
                      </div>
                    </p>
                  ))
                ) : (
                  <p>No reviews available.</p>
                )}
              </ReviewSection>
            )}
            {showRecommendations && (
              // showRecommendations 상태 변수가 true인 경우 추천을 렌더링
              <RecommenSection>
                <h3>Recommen👍</h3>
                {recom[movie.id]?.length > 0 ? (
                  recom[movie.id].map((recom, recomIndex) => (
                    <p key={recomIndex}>
                      <div>
                        <img
                          width="150"
                          src={makeImagePath(recom?.backdrop_path)}
                        />
                        {recom.title}
                      </div>
                    </p>
                  ))
                ) : (
                  <p>No reviews available.</p>
                )}
              </RecommenSection>
            )}

            <div>
              {videos[movie.id]?.length > 0 ? (
                <YouTube
                  videoId={videos[movie.id][0]}
                  opts={{
                    width: "980px",
                    height: "650px",
                    playerVars: {
                      autoplay: 0,
                      modestbranding: 1,
                      loop: 0,
                      playlist: videos[movie.id][0],
                    },
                  }}
                  onReady={(e) => {
                    e.target.mute();
                  }}
                />
              ) : (
                "No Available!"
              )}
            </div>
          </SearchBox>
        ))
      )}
    </div>
  );
};

export default Search;
