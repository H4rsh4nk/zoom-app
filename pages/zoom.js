import { useEffect } from 'react';
import router from 'next/router';
import MeetingStyles from '../styles/zoom.module.css';
const axios = require('axios');
const { ZOOM } = require('../Constants/Zoom')

const Meeting = () => {
    useEffect(() => {
        return async () => {
            new Promise(async (resolve, reject) => {
                const ZoomEmbed = await (await import('@zoomus/websdk/embedded')).default;

                resolve(ZoomEmbed.createClient());
            }).then(async (client) => {
                let meetingSDKElement = document.getElementById('meetingSDKElement');

                client.init({
                    language: 'en-US',
                    zoomAppRoot: meetingSDKElement,
                    customize: {
                        video: {
                            viewSizes: {
                                default: {
                                    height: 600,
                                    width: 600
                                },
                                ribbon: {
                                    width: 400
                                }
                            }
                        },
                        chat: {
                            popper: {
                                placement: 'right',
                            }
                        }
                    }
                });

                let payload = router.query;

                const { data } = await axios({
                    url: '/api/Zoom/',
                    method: 'POST',
                    data: payload
                }).then(response => {
                    return response;
                }).catch(error => {
                    console.log('---signature axios request error ---', error);
                });

                client.join({
                    signature: data.signature,
                    sdkKey: data.sdkKey,
                    meetingNumber: payload.meetingNumber,
                    password: payload.passWord,
                    userName: payload.userName,
                    userEmail: '',
                    tk: '',
                    zak: ''
                 })
            }).catch(error => {
                console.log('---Error inside useEffect---', error);
            });
        }
    });
    return (
        <div className={MeetingStyles.container}>
            <div className={MeetingStyles.meetingSDKElement} id='meetingSDKElement'></div>
            <div className={MeetingStyles.content}>
               
                <form>
                    <div className='flex'>
                        <div className='flex-col'>
                            <label htmlFor='meetingID' className='label flex'>Meeting ID:</label>
                            <input type='text' id='meetingID' placeholder='Enter Meeting ID' />
                        </div>
                        <div className='flex-col'>
                            <label htmlFor='password' className='label flex'>Password:</label>
                            <input type='password' id='password' placeholder='Enter Password' />
                        </div>
                        <div className='flex-col'>
                            <label htmlFor='userName' className='label flex'>User Name:</label>
                            <input type='text' id='userName' placeholder='Enter User Name' />
                        </div>
                    </div>
                    <button className='flex border-2' type="submit" value="Submit" onClick=''> Join </button>
                </form>
                
            </div>
        </div>)


}

Meeting.displayName = 'Zoom Component View';

export default Meeting;

