import React, { useState, useEffect } from 'react'
import {db} from '../firebase';
import { getDocs, collection, query, orderBy, where } from 'firebase/firestore';
import { get } from 'react-hook-form';

export const GetPosts = ({classID}) => { 
    const [announcements, setAnnouncements] = useState(null);
    const [posts, setPosts] = useState(null);
    const [lectures, setLectures] = useState(null);
    const [announcementsDocs, setAnnouncementsDocs] = useState(null);
    const [postsDocs, setPostsDocs] = useState(null);
    const [lecturesDocs, setLecturesDocs] = useState(null);

    const getAnnouncements = async () => {

        try{
            await setAnnouncements(await getDocs(query(collection(db, `posts/${classID}/Announcement`), orderBy("date", "desc"))))
        }
        catch(error){
            console.log("getAnnouncements Error: " + error)
        }
    }

    const getPosts = async () => {
        try{
            await setPosts(await getDocs(query(collection(db,`posts/${classID}/Post`), orderBy("date", "desc"))))
        }
        catch(error){
            console.log("getPosts Error: " + error)
        }
    }

    const getLectures = async () => {
        try{
            await setLectures(await getDocs(query(collection(db, `posts/${classID}/Lecture`), orderBy("date", "desc"))))
        }
        catch(error){
            console.log("getLectures Error: " + error)
        }
    }
    
    const setDatas = async () => {
        if(announcements){const announcementsMap = announcements.docs.map(((elements) => {
            return{
                title: elements.data().title,
                description: elements.data().description,
                fileName: elements.data().fileName,
                file: elements.data().file,
                date:  new Date(elements.data().date.seconds * 1000 + elements.data().date.nanoseconds / 1000000),
                id: elements.id,
                expanded: false
            }
        }))

        setAnnouncementsDocs(announcementsMap)

        const postsMap = posts.docs.map(((elements) => {
            return{
                title: elements.data().title,
                description: elements.data().description,
                fileTitle: elements.data().fileTitle,
                fileName: elements.data().fileName,
                date:  new Date(elements.data().date.seconds * 1000 + elements.data().date.nanoseconds / 1000000),
                id: elements.id,
                expanded: false
            }
        }))

        setPostsDocs(postsMap)

        const lectureMap = lectures.docs.map(((elements) => {
            return{
                title: elements.data().title,
                description: elements.data().description,
                fileName: elements.data().fileName,
                file: elements.data().file,
                date:  new Date(elements.data().date.seconds * 1000 + elements.data().date.nanoseconds / 1000000),
                id: elements.id,
                expanded: false
            }
        }))
        setLecturesDocs(lectureMap)
    
    }

        
    }
    

    const getData = async() => {
        await getAnnouncements();
        await getPosts();
        await getLectures();
    }

    useEffect(()=> {
        getData()
}, [])

    useEffect(() => {
        if(announcements && posts && lectures){
            setDatas()
        }
    }, [announcements, posts, lectures])



  return {
    announcementsDocs,
    postsDocs,
    lecturesDocs
  }
}
