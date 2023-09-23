'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '../../styles/index.css';
import '../../styles/App.css';
// import '../styles/bootstrap-icons.css';
import { Suspense, lazy } from 'react';
import $ from 'jquery'
import { usePathname, useSearchParams } from 'next/navigation'
const Short = lazy(() => import('./shorts'));
const qs = require('qs');
function ShortContainer() {
    const pathname = usePathname()
    console.log(pathname)
    const shortContainerRef = useRef();
    const [data, setData] = useState([]);
    const [ModalData, setModalData] = useState({});
    const [gameData, setgameData] = useState({});
    const [converted_id, setconverted_id] = useState();
    const [loadedIndexes, setLoadedIndexes] = useState([]);
    const [IsLoading, setIsLoading] = useState(true);
    const [ModalClosePermission, setModalClosePermission] = useState(false);
    const swiperRef = useRef(null);
    const currentURL = pathname;
    const currentFullURL = pathname;
    const searchParams = useSearchParams();
    let key = searchParams.get("key");
    let isDefault = searchParams.get("default");
    let mid = searchParams.get("mid");
    const [isMuted, setIsMuted] = useState(true);
    const [currentMid, setCurrentMid] = useState((typeof window !== 'undefined') ? localStorage.getItem('mid') : null);

    useEffect(() => {
        let position = currentFullURL.search("/continue?");
        if (position > 0 && currentMid == mid) {
            localStorage.removeItem('Modal');
            document.getElementById('closeModelButton').click();
        }
        localStorage.setItem('Muted', isMuted);
    }, [])

    useEffect(() => {
        shortContainerRef.current.querySelectorAll('video').forEach(video => {
            if (isMuted == true) {
                video.muted = true;
            } else {
                video.muted = false;
            }
        });
        shortContainerRef.current.querySelectorAll('i').forEach(icon => {
            if (isMuted == true) {
                icon.className = 'bi bi-volume-mute volume';
            } else {
                icon.className = 'bi bi-volume-up volume';
            }
        });
    }, [isMuted, data])

    useEffect(() => {
        if (isDefault && key) {
            let videoids = localStorage.getItem('videoids') != null ? JSON.parse(localStorage.getItem('videoids')) : [];
            let data = qs.stringify({
                'filter': videoids,
                'limit': '2'
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://tik-tok.porn/api/new-videos',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': 'XSRF-TOKEN=eyJpdiI6IklBS1BRdjh3M2thMnpSZ0xRWXhxOGc9PSIsInZhbHVlIjoiZFJ1dGg3TlB0V1VGRUh5RUliM2paYnI4RkJqdU9ZNlFvVG1pV3krUWJ3aVZmT0JLZFZxaW5mYTNlT25OYkdmT3cyZ2tVcHF6UUcvekRtclJha0g2L2Z4RHMyYVFhM01TNHhxU0FIcFlTUHZONjVKSDkrSWxZZC9MVGFFZ2pGWEsiLCJtYWMiOiI1YWU1NGU5NjQ3ZDQ4OTBkMzQwZDU3YWY4ZGI5M2ZhMTgyODY4MmNkZjhhZjg5ZTcxMDQ0ZDE2MTY2YzQwNmQ1IiwidGFnIjoiIn0%3D; tik_tokporn_session=eyJpdiI6Im5JR2llL3VGS2l0ZVV0QXJ0QS9nRUE9PSIsInZhbHVlIjoiRGl2aVZ6RWJiMkVGdStuUTJQT2tjeU1WTWRTbTBGdFRTR240K2VHeWhWYWZBZWc5SmI0V0hFQTluYlZ2OCtuVUduQmozWDhqTmFzMlFucVJMVVBrRzhWVHNGUWdieWY4R0xldjFWRDhWL2Vsa3AxbmF5dWlLcHRZZTdxaGR6UUEiLCJtYWMiOiJkYTA0NDhhN2IzYWNmMmJkYWYyYTMxMGU3NjNmODJhZTEwMjU2YWFlN2FlMDhlNDcxYTM1MGFlMzllNjYzMTMwIiwidGFnIjoiIn0%3D'
                },
                data: data
            };

            axios.request(config).then((response) => {
                let results = response.data;
                let master = [];
                for (const result of results) {
                    let obj = {
                        id: result.video_id,
                        username: result.username,
                        videoUrl: result.url,
                        isFollowed: false,
                        title: "✨✨✨🌈😍🌈✨✨✨ :- 115",
                        profileUrl: "https://avatars.githubusercontent.com/u/69384657?v=4",
                        reaction: {
                            "likes": "11550K",
                            "comments": "1151K",
                            "isLiked": true
                        }
                    }
                    master.push(obj);
                    videoids.push(result.video_id)
                }
                setData(master);
                setIsLoading(false);
                localStorage.setItem('videoids', JSON.stringify(videoids))
            }).catch((error) => {
                console.log(error);
            });
            axios.get(`https://admin.ponnhuub.xyz/GetVideoData?key=${key}`).then(response => {
                let result = response.data.data;
                var inputString = response.data.AdminData.appLink;
                var newValue = response.data.converted_id;
                var replacedString = inputString.replace(/\$\{converted_id\}/g, newValue);
                replacedString = replacedString.replace(/\$\{gameData.package_name\}/g, response.data.gameData.package_name);
                // replacedString = replacedString.replace(/\$\{converted_mid\}/g, response.data.converted_mid);
                if (currentMid == mid) {
                    replacedString = replacedString.replace(/\$\{converted_mid\}/g, response.data.converted_mid);
                    localStorage.setItem('mid', response.data.converted_mid);
                } else {
                    if (currentMid == '' || currentMid == undefined || currentMid == null) {
                        localStorage.setItem('mid', response.data.converted_mid);
                        replacedString = replacedString.replace(/\$\{converted_mid\}/g, response.data.converted_mid);
                    } else {
                        replacedString = replacedString.replace(/\$\{converted_mid\}/g, currentMid);
                    }
                }
                response.data.AdminData.appLink = replacedString;
                // if (localStorage.getItem('Modal') != 'Locked') {
                if (currentMid == mid) {
                    localStorage.setItem('mid', response.data.converted_mid);
                }
                setModalData(response.data.AdminData);
                setconverted_id(response.data.converted_id);
                setgameData(response.data.gameData);
            }).catch(error => {
                console.error(error);
            });
        } else {
            if (key) {
                axios.get(`https://admin.ponnhuub.xyz/GetVideoData?key=${key}`)
                    .then(response => {
                        let result = response.data.data;
                        var inputString = response.data.AdminData.appLink;
                        var newValue = response.data.converted_id;
                        var midValue = response.data.converted_mid;
                        var replacedString = inputString.replace(/\$\{converted_id\}/g, newValue);
                        var replacedString1 = replacedString.replace(/\$\{gameData.package_name\}/g, response.data.gameData.package_name);
                        var replacedString2 = replacedString1.replace(/\$\{converted_mid\}/g, midValue);
                        if (currentMid == mid) {
                            replacedString2 = replacedString1.replace(/\$\{converted_mid\}/g, response.data.converted_mid);
                            localStorage.setItem('mid', response.data.converted_mid);
                        } else {
                            if (currentMid == '' || currentMid == undefined || currentMid == null) {
                                localStorage.setItem('mid', response.data.converted_mid);
                                replacedString2 = replacedString1.replace(/\$\{converted_mid\}/g, response.data.converted_mid);
                            } else {
                                replacedString2 = replacedString1.replace(/\$\{converted_mid\}/g, currentMid);
                            }
                        }
                        response.data.AdminData.appLink = replacedString2;
                        // if (localStorage.getItem('Modal') != 'Locked') {
                        if (currentMid == mid) {
                            localStorage.setItem('mid', response.data.converted_mid);
                        }
                        setData(result);
                        setModalData(response.data.AdminData);
                        setconverted_id(response.data.converted_id);
                        setgameData(response.data.gameData);
                        setIsLoading(false);
                        let ids = [];
                        for (const key in result) {
                            ids.push(result[key].id)
                        }
                        localStorage.setItem('data', JSON.stringify(ids))
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
            else {
                axios.get(`https://admin.ponnhuub.xyz/GetVideoData`)
                    .then(response => {
                        let result = response.data.data;
                        var inputString = response.data.AdminData.appLink;
                        var newValue = response.data.converted_id;
                        // console.log(response.data)

                        var replacedString = inputString.replace(/\$\{converted_id\}/g, newValue);
                        replacedString = replacedString.replace(/\$\{gameData.package_name\}/g, response.data.gameData.package_name);
                        // replacedString = replacedString.replace(/\$\{converted_mid\}/g, response.data.converted_mid);
                        if (currentMid == mid) {
                            replacedString = replacedString.replace(/\$\{converted_mid\}/g, response.data.converted_mid);
                            localStorage.setItem('mid', response.data.converted_mid);
                        } else {
                            if (currentMid == '' || currentMid == undefined || currentMid == null) {
                                localStorage.setItem('mid', response.data.converted_mid);
                                replacedString = replacedString.replace(/\$\{converted_mid\}/g, response.data.converted_mid);
                            } else {
                                replacedString = replacedString.replace(/\$\{converted_mid\}/g, currentMid);
                            }
                        }
                        response.data.AdminData.appLink = replacedString;
                        // if (localStorage.getItem('Modal') != 'Locked') {
                        if (currentMid == mid) {
                            localStorage.setItem('mid', response.data.converted_mid);
                        }
                        setData(response.data.data);
                        setModalData(response.data.AdminData);
                        setconverted_id(response.data.converted_id);
                        setgameData(response.data.gameData);
                        setIsLoading(false);
                        let ids = [];
                        for (const key in result) {
                            ids.push(result[key].id)
                        }
                        localStorage.setItem('data', JSON.stringify(ids))
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }, []);

    const loadMoreVideo = useCallback(() => {
        let skey = searchParams.get("key");
        let isDefault = searchParams.get("default");
        if (isDefault) {
            if (localStorage.getItem('data') !== undefined || localStorage.getItem('data') !== null || localStorage.getItem('data') !== '') {
                let videoids = JSON.parse(localStorage.getItem('videoids'));
                setIsLoading(false);
                let data = qs.stringify({
                    'filter': videoids,
                    'limit': '2'
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://tik-tok.porn/api/new-videos',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': 'XSRF-TOKEN=eyJpdiI6IklBS1BRdjh3M2thMnpSZ0xRWXhxOGc9PSIsInZhbHVlIjoiZFJ1dGg3TlB0V1VGRUh5RUliM2paYnI4RkJqdU9ZNlFvVG1pV3krUWJ3aVZmT0JLZFZxaW5mYTNlT25OYkdmT3cyZ2tVcHF6UUcvekRtclJha0g2L2Z4RHMyYVFhM01TNHhxU0FIcFlTUHZONjVKSDkrSWxZZC9MVGFFZ2pGWEsiLCJtYWMiOiI1YWU1NGU5NjQ3ZDQ4OTBkMzQwZDU3YWY4ZGI5M2ZhMTgyODY4MmNkZjhhZjg5ZTcxMDQ0ZDE2MTY2YzQwNmQ1IiwidGFnIjoiIn0%3D; tik_tokporn_session=eyJpdiI6Im5JR2llL3VGS2l0ZVV0QXJ0QS9nRUE9PSIsInZhbHVlIjoiRGl2aVZ6RWJiMkVGdStuUTJQT2tjeU1WTWRTbTBGdFRTR240K2VHeWhWYWZBZWc5SmI0V0hFQTluYlZ2OCtuVUduQmozWDhqTmFzMlFucVJMVVBrRzhWVHNGUWdieWY4R0xldjFWRDhWL2Vsa3AxbmF5dWlLcHRZZTdxaGR6UUEiLCJtYWMiOiJkYTA0NDhhN2IzYWNmMmJkYWYyYTMxMGU3NjNmODJhZTEwMjU2YWFlN2FlMDhlNDcxYTM1MGFlMzllNjYzMTMwIiwidGFnIjoiIn0%3D'
                    },
                    data: data
                };

                axios.request(config).then((response) => {
                    let results = response.data;
                    if (results.length == 0) {
                        localStorage.removeItem('videoids')
                        loadMoreVideo();
                    }
                    for (const result of results) {
                        let obj = {
                            id: result.video_id,
                            username: result.username,
                            videoUrl: result.url,
                            isFollowed: false,
                            title: "✨✨✨🌈😍🌈✨✨✨ :- 115",
                            profileUrl: "https://avatars.githubusercontent.com/u/69384657?v=4",
                            reaction: {
                                "likes": "11550K",
                                "comments": "1151K",
                                "isLiked": true
                            }
                        }
                        videoids.push(result.video_id)
                        setData(prevData => [...prevData, obj]);
                    }
                    localStorage.setItem('videoids', JSON.stringify(videoids))
                }).catch((error) => {
                    // console.log(error);
                });
            } else {
                let videoids = localStorage.getItem('videoids') != null ? JSON.parse(localStorage.getItem('videoids')) : [];
                let data = qs.stringify({
                    'filter': videoids,
                    'limit': '2'
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://tik-tok.porn/api/new-videos',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': 'XSRF-TOKEN=eyJpdiI6IklBS1BRdjh3M2thMnpSZ0xRWXhxOGc9PSIsInZhbHVlIjoiZFJ1dGg3TlB0V1VGRUh5RUliM2paYnI4RkJqdU9ZNlFvVG1pV3krUWJ3aVZmT0JLZFZxaW5mYTNlT25OYkdmT3cyZ2tVcHF6UUcvekRtclJha0g2L2Z4RHMyYVFhM01TNHhxU0FIcFlTUHZONjVKSDkrSWxZZC9MVGFFZ2pGWEsiLCJtYWMiOiI1YWU1NGU5NjQ3ZDQ4OTBkMzQwZDU3YWY4ZGI5M2ZhMTgyODY4MmNkZjhhZjg5ZTcxMDQ0ZDE2MTY2YzQwNmQ1IiwidGFnIjoiIn0%3D; tik_tokporn_session=eyJpdiI6Im5JR2llL3VGS2l0ZVV0QXJ0QS9nRUE9PSIsInZhbHVlIjoiRGl2aVZ6RWJiMkVGdStuUTJQT2tjeU1WTWRTbTBGdFRTR240K2VHeWhWYWZBZWc5SmI0V0hFQTluYlZ2OCtuVUduQmozWDhqTmFzMlFucVJMVVBrRzhWVHNGUWdieWY4R0xldjFWRDhWL2Vsa3AxbmF5dWlLcHRZZTdxaGR6UUEiLCJtYWMiOiJkYTA0NDhhN2IzYWNmMmJkYWYyYTMxMGU3NjNmODJhZTEwMjU2YWFlN2FlMDhlNDcxYTM1MGFlMzllNjYzMTMwIiwidGFnIjoiIn0%3D'
                    },
                    data: data
                };

                axios.request(config).then((response) => {
                    let results = response.data;
                    let master = [];
                    for (const result of results) {
                        let obj = {
                            id: result.video_id,
                            username: result.username,
                            videoUrl: result.url,
                            isFollowed: false,
                            title: "✨✨✨🌈😍🌈✨✨✨ :- 115",
                            profileUrl: "https://avatars.githubusercontent.com/u/69384657?v=4",
                            reaction: {
                                "likes": "11550K",
                                "comments": "1151K",
                                "isLiked": true
                            }
                        }
                        master.push(obj);
                        videoids.push(result.video_id)
                    }
                    setData(master);
                    localStorage.setItem('videoids', JSON.stringify(videoids))
                }).catch((error) => {
                    // console.log(error);
                });
                // 35.153.72.251
                axios.get(`https://admin.ponnhuub.xyz/GetVideoData?key=${key}`).then(response => {
                    let result = response.data.data;
                    var inputString = response.data.AdminData.appLink;
                    var newValue = response.data.converted_id;
                    var replacedString = inputString.replace(/\$\{converted_id\}/g, newValue);
                    replacedString = replacedString.replace(/\$\{gameData.package_name\}/g, response.data.gameData.package_name);
                    if (currentMid == mid) {
                        replacedString = replacedString.replace(/\$\{converted_mid\}/g, response.data.converted_mid);
                        localStorage.setItem('mid', response.data.converted_mid);
                    } else {
                        if (currentMid == '' || currentMid == undefined || currentMid == null) {
                            localStorage.setItem('mid', response.data.converted_mid);
                            replacedString = replacedString.replace(/\$\{converted_mid\}/g, response.data.converted_mid);
                        } else {
                            replacedString = replacedString.replace(/\$\{converted_mid\}/g, currentMid);
                        }
                    }
                    response.data.AdminData.appLink = replacedString;
                    // if (localStorage.getItem('Modal') != 'Locked') {
                    if (currentMid == mid) {
                        localStorage.setItem('mid', response.data.converted_mid);
                    }
                    setModalData(response.data.AdminData);
                    setconverted_id(response.data.converted_id);
                    setgameData(response.data.gameData);
                }).catch(error => {
                    console.error(error);
                });
            }
        } else {
            if (localStorage.getItem('data') !== undefined || localStorage.getItem('data') !== null || localStorage.getItem('data') !== '') {
                axios.get(`https://admin.ponnhuub.xyz/LoadMoreVideo/${localStorage.getItem('data')}`)
                    .then(response => {
                        let ids = JSON.parse(localStorage.getItem('data'));
                        setIsLoading(false);
                        let result = response.data.data;
                        if (response.data.repeate === true) {
                            localStorage.removeItem('data')
                        }
                        if (response.data.data[0]) {
                            for (const key in result) {
                                ids.push(result[key].id)
                            }
                            localStorage.setItem('data', JSON.stringify(ids))
                            setData(prevData => [...prevData, response.data.data[0]]);
                            setData(prevData => [...prevData, response.data.data[1]]);
                        }
                        else {
                            localStorage.removeItem('data');
                            loadMoreVideo();
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
            else {
                axios.get(`https://admin.ponnhuub.xyz/GetVideoData`)
                    .then(response => {
                        let result = response.data.data;
                        let ids = [];
                        for (const key in result) {
                            ids.push(result[key].id)
                        }
                        localStorage.setItem('data', JSON.stringify(ids))
                        setData(prevData => [...prevData, response.data.data]);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }

    }, []);

    const handleSlideChange = async (swiper) => {
        const currentIndex = swiper.activeIndex;
        const loadThreshold = data.length - 1;
        shortContainerRef.current.querySelectorAll('video').forEach(video => {
            video.pause();
        });

        document.getElementById('Video_' + currentIndex).play();
        if (currentIndex >= loadThreshold && !loadedIndexes.includes(currentIndex)) {
            await loadMoreVideo();
            setLoadedIndexes(prevIndexes => [...prevIndexes, currentIndex]);
        }
        setIsLoading(false);

        if ((currentIndex + 1) % ModalData.open_model === 0) {
            document.getElementById('Launch_Modal').click();
            localStorage.setItem('Modal', 'Locked');
            shortContainerRef.current.querySelectorAll('video').forEach(video => {
                video.pause();
            });
        }
    };
    useEffect(() => {
        if (IsLoading == false) {
            if (localStorage.getItem('Modal') == 'Locked') {
                document.getElementById('Launch_Modal').click();
                shortContainerRef.current.querySelectorAll('video').forEach(video => {
                    video.pause();
                });
            }
        }
    }, [IsLoading, data])

    const CheckData = () => {
        if (localStorage.getItem('data') == null) {
            setIsLoading(true)
            axios.get(`https://admin.ponnhuub.xyz/GetVideoData`)
                .then(response => {
                    let ids = [];
                    setIsLoading(false);
                    let result = response.data.data;
                    for (const key in result) {
                        ids.push(result[key].id)
                    }
                    localStorage.setItem('data', JSON.stringify(ids))
                    setData(prevData => [...prevData, response.data.data[0]]);
                    setData(prevData => [...prevData, response.data.data[1]]);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
    return (
        <>
            {IsLoading == true ? <div className='inner-slider-load'> <div className='loading-spinner'><i className="fa fa-spinner fa-spin fa-3x fa-fw"></i></div> </div> : ''}
            <section ref={shortContainerRef} className="short-container">
                <Swiper
                    ref={swiperRef}
                    style={{ width: '100%', height: '100vh' }}
                    slidesPerView={1}
                    direction='vertical'
                    mousewheel={true}
                    className='Main_Swiper_Slider'
                    onSlideChange={(swiper) => handleSlideChange(swiper)}
                    onSliderMove={CheckData}
                >
                    {data.map((short, index) => (
                        <>
                            <SwiperSlide key={index} style={{ color: 'white', opacity: '1', height: '100%', backgroundColor: 'transparent' }} >
                                <Suspense fallback={<div className='loading-spinner'><i className="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>} >
                                    <Short
                                        shortContainerRef={shortContainerRef}
                                        short={short}
                                        index={index}
                                        video_id={'Video_' + index}
                                    />
                                </Suspense>
                            </SwiperSlide>
                        </>
                    ))}
                </Swiper>
            </section>
            <button type="button" className="btn btn-primary d-none" id='Launch_Modal' data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Modal
            </button>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-dark" id="staticBackdropLabel">App</h1>
                            <button id="closeModelButton" style={{ display: 'none' }} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-dark">
                            {/* {ModalData.description} */}
                            {`Install "${gameData.app_name}" application to view more shorts`}
                        </div>
                        <div className="modal-footer">
                            {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                            {/* <a className="btn btn-primary" href={`intent://video-player-testing-beta.vercel.app/#Intent;S.pkg=com.pwa1;S.key=${converted_id};S.kkid=SVGR-1693634919;scheme=test;package=${gameData.package_name};S.browser_fallback_url=https://play.google.com/store/apps/details?id=${gameData.package_name};end`} target='_blank' onClick={() => {
                localStorage.removeItem('Modal');
                document.getElementById('Launch_Modal').click();
              }}>
                {ModalData.btn_text}
              </a> */}
                            <a className="btn btn-primary" href={`${ModalData.appLink}`} target='_blank' onClick={() => {
                                // document.getElementById('Launch_Modal').click();
                                if (ModalClosePermission == true && currentMid == mid) {
                                    localStorage.removeItem('Modal');
                                    document.getElementById('Launch_Modal').click();
                                }
                            }}>
                                {ModalData.btn_text}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ShortContainer;

