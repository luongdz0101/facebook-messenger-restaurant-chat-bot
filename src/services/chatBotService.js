import request from "request";

require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const URL_SHOW_ROOM_GIF = "https://media3.giphy.com/media/TGcD6N8uzJ9FXuDV3a/giphy.gif?cid=ecf05e47afe5be971d1fe6c017ada8e15c29a76fc524ac20&rid=giphy.gif";
const URL_SALAD_GIF = "https://media0.giphy.com/media/9Vk8qP9EmWB8FePccb/giphy.gif?cid=ecf05e478d0c93d69e72264c8ebbf58a9a1d7ae294754131&rid=giphy.gif";
const URL_SHOW_FISH = "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/ztjeouq2jlas5b2zxksm";
const URL_SHOW_CLASSIC = "https://ardo.com/files/attachments/.10202/w1440h700q85_AZ1.jpg";
let getFacebookUsername = (sender_psid) => {
    
    return new Promise((resolve, reject) => {
        // Send the HTTP request to the Messenger Platform
        let uri = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`;
        request({
            "uri": uri,
            "method": "GET",
        }, (err, res, body) => {
            if (!err) {
                //convert string to json object
                body = JSON.parse(body);
                let username = `${body.last_name} ${body.first_name}`;
                resolve(username);
            } else {
                reject("Unable to send message:" + err);
            }
        });
    });
};

let setupProfile = async(req, res) => {
        
        let request_body = {
          "get_started" : {"payload" : "GET_STARTED"},
         
        }

        // Send the HTTP request to the Messenger Platform
        await request({
          "uri": `https://graph.facebook.com/v18.0/me/messenger_profile?access_token = ${PAGE_ACCESS_TOKEN}`,
          "qs": { "access_token": PAGE_ACCESS_TOKEN },
          "method": "POST",
          "json": request_body
        }, (err, res, body) => {
          if (!err) {
            console.log('Setup user profile succeeds!')
          } else {
            console.error("Unable to user profile:" + err);
          }
        }); 

        return res.send("Setup user profile succeeds!");
}
let sendResponseWelcomeNewCustomer = (username, sender_psid, sender_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response_first = { "text": `Chào ${username} đến với phòng khám nhi khoa Hoàng Gia!` };
            let response_second = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Phòng khám nhi khoa Hoàng Gia",
                                "subtitle": "Phòng khám uy tín dành cho các bạn nhỏ, với các bác sĩ chuyên khoa có kinh nghiệm hàng đầu",
                                "image_url": "https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-6/397879836_122131328654031859_2125483808512469227_n.png?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=caorP7_CGIwAb70s-uQ&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBNACnHdOBdnaipfQYLUZiYY7JkKVZJXfqsvNvilv5o8A&oe=66157D56",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Hiện thị các dịch vụ",
                                        "payload": "MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt phòng khám",
                                        "payload": "RESERVE_TABLE",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Hướng dẫn sủ dụng chat bot này!",
                                        "payload": "GUIDE_BOT",
                                    }
                                ],
                            } ]
                    }
                }
            };

            //send a welcome message
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response_first);

            //send a image with button view main menu
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response_second);

            resolve("done!")
        } catch (e) {
            reject(e);
        }

    });
};

let sendMainMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Dịch vụ phòng khám",
                                "subtitle": "Bao gồm danh sách các chuyên khoa, chi tiết về giá khám,  ơi cung cấp dịch vụ chăm sóc sức khỏe trẻ em toàn diện và chuyên nghiệp. Với đội ngũ y bác sĩ chuyên khoa nhi dày dặn kinh nghiệm và trang thiết bị hiện đại, chúng tôi cam kết mang lại dịch vụ chăm sóc sức khỏe tốt nhất cho bé yêu của bạn.",
                                "image_url": "http://www.benhviennhi.org.vn/upload/images/CamScanner%2012-17-2020%2009_05_1.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Danh sách bác sĩ",
                                        "payload": "LUNCH_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Danh sách các bệnh thông thường",
                                        "payload": "DINNER_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Hỏi đáp bác sĩ",
                                        "payload": "PUB_MENU",
                                    }
                                ],
                            },

                            {
                                "title": "Giờ đang trống",
                                "subtitle": "07:30 - 08:30 vs 08:30 - 09:30 vs 09:30 - 10:30 vs 10:30 - 11h30 vs 14:30 - 15:30 vs 15:30 - 16:30 vs 16:30 - 17:30 ",
                                "image_url": " https://honghunghospital.com.vn/wp-content/uploads/2020/05/Artboard-3-100-6.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Đặt phòng khám",
                                        "payload": "RESERVE_TABLE",
                                    }
                                ],
                            },

                            {
                                "title": "Về phòng khám",
                                "subtitle": "Chúng tôi là nơi chuyên cung cấp các dịch vụ y tế cho trẻ em, từ kiểm tra sức khỏe định kỳ đến chăm sóc bệnh lý. Với đội ngũ y tế giàu kinh nghiệm và môi trường thoải mái, chúng tôi cam kết mang lại sự chăm sóc tốt nhất cho bé yêu của bạn. Hãy đến và trải nghiệm dịch vụ chất lượng của chúng tôi ngay hôm nay!",
                                "image_url": "https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-6/394249067_1507760433324483_4621172528138551683_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=viHejgsiYAoAb4gCO-7&_nc_ht=scontent.fhan5-11.fna&oh=00_AfAftsAG6VFeg42KXvrpCg5HU-M8vpi22VsWWkHaNb5ueQ&oe=661698F1",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Thông tin phòng khám",
                                        "payload": "SHOW_ROOMS",
                                    }
                                ],
                            }


                        ]
                    }
                }
            };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });

};

let sendLunchMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Phó Giáo sư, Tiến sĩ, Bác sĩ Nguyễn Thị Hoài An",
                                "image_url": "https://cdn.bookingcare.vn/fo/w256/2020/01/03/090559-pgs-nguyen-thi-hoai-an.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Thông tin lịch khám",
                                        "payload": "SHOW_APPETIZERS",
                                    }
                                ],
                            },

                            {
                                "title": "Bác sĩ Chuyên khoa I Lưu Thị Phương Thanh ",
                                "image_url": "https://cdn.bookingcare.vn/fo/w256/2022/07/04/144133-bs-luu-thi-phuong-thanh-1.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Thông tin lịch khám",
                                        "payload": "SHOW_ENTREE_SALAD",
                                    }
                                ],
                            },

                            {
                                "title": "Thạc sĩ, Bác sĩ chuyên khoa II Vũ Duy Chinh",
                                "image_url": "https://cdn.bookingcare.vn/fo/w256/2022/05/11/150958-ths-bs-vu-duy-chinh-phcn-ecohealth.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Thông tin lịch khám",
                                        "payload": "SHOW_FISH",
                                    }
                                ],
                            },
                             {
                                "title": "Bác sĩ chuyên khoa II Nguyễn Bạch Huệ",
                                "image_url": "https://cdn.bookingcare.vn/fo/w256/2020/11/03/110013-bac-si-ckii-nguyen-bach-hue.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Thông tin lịch khám",
                                        "payload": "SHOW_CLASSICS",
                                    }
                                ],
                            },

                            // {
                            //     "title": "Bác sĩ chuyên khoa II Nguyễn Bạch Huệ",
                            //     "subtitle": "and Dry-aged on Premise",
                            //     "image_url": "https://cdn.bookingcare.vn/fo/w256/2020/11/03/110013-bac-si-ckii-nguyen-bach-hue.jpg",
                            //     "buttons": [
                            //         {
                            //             "type": "postback",
                            //             "title": "Thông tin lịch khám",
                            //             "payload": "SHOW_CLASSICS",
                            //         }
                            //     ],
                            // },

                            {
                                "title": "Quay lại",
                                "image_url": "https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-6/397879836_122131328654031859_2125483808512469227_n.png?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=caorP7_CGIwAb70s-uQ&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBNACnHdOBdnaipfQYLUZiYY7JkKVZJXfqsvNvilv5o8A&oe=66157D56",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Quay lại phần dịch vụ",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt lịch khám",
                                        "payload": "RESERVE_TABLE",
                                    }
                                ],
                            }
                        ]
                    }
                }
            };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};

let sendDinnerMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = {
                "text": "Bệnh đường hô hấp:\n - Viêm phế quản, viêm phổi\n - Suyễn, hen suyễn\n - Viêm họng do virus\n - Bệnh truyền nhiễm khác "
            };

            let response2 = {
                "text": "Bệnh nhiễm trùng và viêm nhiễm:\n - Viêm họng\n - Viêm tai giữa\n - Viêm mũi, viêm xoang\n - Bệnh tay chân miệng"
            };
            let response3 = {
                "text": "Rối loạn tiêu hóa và dinh dưỡng:\n - Tiêu chảy và nôn mửa\n - Táo bón\n - Đau bụng\n - Tiểu tiện không tự chủ\n - Rối loạn tiểu tiện"
            };

            let response4 = {
                "text": "Rối loạn dinh dưỡng và chuyển hóa:\n - Phát ban\n - Rối loạn dinh dưỡng\n - Suy dinh dưỡng\n - Bệnh tăng huyết áp"
            };
            let response5 = {
                "text": "Bệnh da liễu và dị ứng:\n - Viêm da, viêm da dị ứng"
            };
            let response6 = {
                "text": "Các vấn đề sức khỏe khác:\n - Bệnh đau đầu, đau bụng\n - Suy giảm miễn dịch\n - Viêm não mô cầu"
            };
             let response7 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response3);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response4);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response5);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response6);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response7);

            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};

let sendPubMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            
             let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Câu hỏi của bệnh nhân",
                                "subtitle": "Con tôi bị sốt, làm thế nào để điều trị và làm giảm sốt cho con?",
                                "image_url": "https://tamanhhospital.vn/wp-content/uploads/2023/06/cach-ha-sot-cho-tre.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Trả lời của bác sĩ",
                                        "payload": "REPLY",
                                    }
                                ],
                            },
                            {
                                "title": "Câu hỏi của bệnh nhân",
                                "subtitle": "Con tôi có triệu chứng ho, sổ mũi và đau họng. Đây có phải là cảm lạnh không?",
                                "image_url": "https://www.vinmec.com/s3-images/size/xxxlarge/20200227_081927_403088_sot-cao.max-1800x1800.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Trả lời của bác sĩ",
                                        "payload": "REPLY_1",
                                    }
                                ],
                            },
                            {
                                "title": "Câu hỏi của bệnh nhân",
                                "subtitle": "Con tôi thường xuyên bị ho và khó thở, liệu có thể là bệnh hen suyễn không?",
                                "image_url": "https://vinmec-prod.s3.amazonaws.com/images/20190913_020015_938698_hen_vinmec.max-1800x1800.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Trả lời của bác sĩ",
                                        "payload": "REPLY_2",
                                    }
                                ],
                            },
                            {
                                "title": "Câu hỏi của bệnh nhân",
                                "subtitle": "Con tôi hay đau bụng và tiêu chảy sau khi ăn. Đây có thể là triệu chứng của bệnh gì?",
                                "image_url": "https://www.vinmec.com/s3-images/20210722_165351_173689_Di_ngoai_2_lan_phan_s.max-800x800.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Trả lời của bác sĩ",
                                        "payload": "REPLY_3",
                                    }
                                ],
                            },
                            {
                                "title": "Câu hỏi của bệnh nhân",
                                "subtitle": "Con tôi thường xuyên có các vết phát ban trên da, liệu đây có thể là dấu hiệu của bệnh dị ứng không?",
                                "image_url": "https://hoanmy.com/wp-content/uploads/2023/09/phat-ban.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Trả lời của bác sĩ",
                                        "payload": "REPLY_4",
                                    }
                                ],
                            },
                             {
                                "title": "Câu hỏi của bệnh nhân",
                                "subtitle": "Con tôi bị tiêu chảy và buồn nôn sau khi tiếp xúc với một loại thực phẩm mới. Liệu đây có thể là dấu hiệu của dị ứng thực phẩm không?",
                                "image_url": "https://tambinh.vn/wp-content/uploads/2020/07/NORMAL-Shutterstock-494312500.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Trả lời của bác sĩ",
                                        "payload": "REPLY_5",
                                    }
                                ],
                            },
                            {
                                "title": "Câu hỏi của bệnh nhân",
                                "subtitle": "Con tôi thường xuyên ho và đau ngực, liệu có thể là dấu hiệu của một vấn đề nghiêm trọng không?",
                                "image_url": "https://medlatec.vn/ImagePath/images/20200904/20200904_ho-tuc-nguc-kho-tho-3.jpg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Trả lời của bác sĩ",
                                        "payload": "REPLY_6",
                                    }
                                ],
                            },
                            {
                                "title": "Quay lại thông tin dịch vụ hoặc đặt phòng khám?",
                                "image_url": "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/9/22/bv-nhi-6-large-16638376434461295760401-1663846429403541748240.jpeg",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Thông tin dịch vụ",
                                        "payload": "MAIN_MENU"
                                    },
                                    {
                                       "type": "postback",
                                        "title": "Đặt phòng khám",
                                        "payload": "RESERVE_TABLE",
                                    }
                                ],
                            },

                            


                        ]
                    }
                }
            };
        

         

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);


         
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};

let sendReply = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
             let response2 = {
                 "text": "Câu hỏi: Con tôi bị sốt, làm thế nào để điều trị và làm giảm sốt cho con?"
            };
            let response = {
                 "text": "Trả lời: Đầu tiên, bạn cần đo nhiệt độ của trẻ bằng nhiệt kế. Nếu nhiệt độ cao hơn 38 độ C, bạn có thể sử dụng paracetamol hoặc ibuprofen theo liều lượng phù hợp với trọng lượng của trẻ và tuổi tác của chúng. Ngoài ra, giữ cho trẻ uống đủ nước và nghỉ ngơi. Nếu sốt kéo dài hoặc đi kèm với các triệu chứng khác, hãy đưa trẻ đến bác sĩ."
            };

             let response1 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
             await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            
        } catch (e) {
            reject(e);
        }
    });
};
let sendReply_1 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                 "text": "Câu hỏi: Có thể là cảm lạnh, nhưng cũng có thể là triệu chứng của một số bệnh khác như cúm. Để xác định chính xác, hãy quan sát các triệu chứng và đưa trẻ đến bác sĩ nếu triệu chứng trở nên nặng hơn hoặc kéo dài."
            };

             let response2 = {
                 "text": "Trả lời: Con tôi có triệu chứng ho, sổ mũi và đau họng. Đây có phải là cảm lạnh không?"
            };
             let response1 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };
             await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
             await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            
        } catch (e) {
            reject(e);
        }
    });
};
let sendReply_2 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response2 = {
                 "text": "Câu hỏi: Con tôi thường xuyên bị ho và khó thở, liệu có thể là bệnh hen suyễn không?"
            };
            let response = {
                 "text": "Trả lời: Có thể, nhưng để đưa ra chẩn đoán chính xác, bác sĩ sẽ cần kiểm tra triệu chứng của trẻ và có thể yêu cầu thêm các xét nghiệm hoặc kiểm tra. Hen suyễn là một bệnh mãn tính, và việc điều trị đòi hỏi sự theo dõi thường xuyên từ bác sĩ."
            };

             let response1 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
             await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
          
        } catch (e) {
            reject(e);
        }
    });
};
let sendReply_3 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response2 = {
                 "text": "Câu hỏi: Con tôi hay đau bụng và tiêu chảy sau khi ăn. Đây có thể là triệu chứng của bệnh gì?"
            };
            
            let response = {
                 "text": "Trả lời: Triệu chứng này có thể là dấu hiệu của nhiều vấn đề khác nhau như dị ứng thức ăn, nhiễm trùng đường ruột, hoặc tiêu chảy vi khuẩn. Việc điều trị phụ thuộc vào nguyên nhân cụ thể, nên nếu triệu chứng kéo dài hoặc nặng hơn, bạn nên đưa trẻ đến bác sĩ."
            };

             let response1 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };

             await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
             await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
             
            
        } catch (e) {
            reject(e);
        }
    });
};
let sendReply_4 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                 "text": "Câu hỏi: Có thể, vì các vết phát ban trên da thường là một trong những dấu hiệu của dị ứng. Tuy nhiên, để xác định nguyên nhân chính xác, bạn nên tìm kiếm sự tư vấn từ bác sĩ, người có thể thực hiện các kiểm tra và đưa ra lời khuyên phù hợp"
            };
            let response2 = {
                 "text": "Trả lời: Con tôi thường xuyên có các vết phát ban trên da, liệu đây có thể là dấu hiệu của bệnh dị ứng không?"
            };
             let response1 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
             await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
              
        } catch (e) {
            reject(e);
        }
    });
};
let sendReply_5 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                 "text": "Câu hỏi: Đúng vậy, các triệu chứng như tiêu chảy và buồn nôn sau khi tiếp xúc với một loại thực phẩm mới có thể là dấu hiệu của dị ứng thực phẩm. Để xác định thực sự, bạn nên tìm kiếm sự tư vấn từ bác sĩ và có thể cần phải thực hiện các xét nghiệm chẩn đoán."
            };
            let response2 = {
                 "text": "Trả lời: Con tôi bị tiêu chảy và buồn nôn sau khi tiếp xúc với một loại thực phẩm mới. Liệu đây có thể là dấu hiệu của dị ứng thực phẩm không?"
            };

             let response1 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };
             await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
             await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            
        } catch (e) {
            reject(e);
        }
    });
};

let sendReply_6 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                 "text": "Câu hỏi: Có thể, ho và đau ngực có thể là dấu hiệu của nhiều vấn đề khác nhau, từ viêm phổi đến bệnh tim và phổi. Nếu triệu chứng này kéo dài hoặc nặng hơn, bạn nên đưa trẻ đến bác sĩ để được kiểm tra và đưa ra đánh giá chính xác."
            };
            let response2 = {
                 "text": "Trả lời: Con tôi thường xuyên ho và đau ngực, liệu có thể là dấu hiệu của một vấn đề nghiêm trọng không?"
            };

             let response1 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            
        } catch (e) {
            reject(e);
        }
    });
};
let sendAppetizer = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Các khung thời gian trống vào thứ hai",
                                "subtitle": "07:30 - 08:30 vs 08:30 - 09:30 vs 09:30 - 10:30",
                                "image_url": "https://www.psychologicalscience.org/redesign/wp-content/uploads/2015/11/PAFF_010317_mondaygoalsetting-1024x684.jpg",
                            },
                            {
                                "title": "Các khung thời gian trống vào thứ ba",
                                "subtitle": "07:30 - 08:30 vs 08:30 - 09:30 vs 09:30 - 10:30",
                                "image_url": "https://blog.xoxoday.com/content/images/size/w692/format/webp/2023/02/Tuesday-Motivational-Quotes-for-Work.png",
                            },
                            {
                                "title": "Các khung thời gian trống vào thứ tư",
                                "subtitle": "07:30 - 08:30 vs 08:30 - 09:30 vs 09:30 - 10:30",
                                "image_url": "https://www.thefactsite.com/wp-content/uploads/2017/07/wednesday-facts.webp",
                            },
                            {
                                "title": "Các khung thời gian trống vào thứ năm",
                                "subtitle": "07:30 - 08:30 vs 08:30 - 09:30 vs 09:30 - 10:30",
                                "image_url": "https://blog.xoxoday.com/content/images/size/w692/format/webp/2023/02/Thursday-Motivational-Quotes-for-Work.png",
                            },
                            {
                                "title": "Các khung thời gian trống vào thứ sáu",
                                "subtitle": "07:30 - 08:30 vs 08:30 - 09:30 vs 09:30 - 10:30",
                                "image_url": "https://static.vecteezy.com/system/resources/previews/021/902/607/non_2x/happy-friday-relax-or-enjoy-last-working-day-and-embrace-weekend-tried-routine-day-job-employee-joyful-lifestyle-after-stressful-week-long-happy-businessman-jumping-while-holding-friday-sign-vector.jpg",
                            },
                            {
                                "title": "Các khung thời gian trống vào thứ bảy",
                                "subtitle": "07:30 - 08:30 vs 08:30 - 09:30 vs 09:30 - 10:30",
                                "image_url": "https://curioustimes.in/wp-content/uploads/2020/08/Saturday-Whats-in-a-word.jpg",
                            },                
                            {
                                "title": "Quay lại",
                                "image_url": "https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-6/397879836_122131328654031859_2125483808512469227_n.png?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=caorP7_CGIwAb70s-uQ&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBNACnHdOBdnaipfQYLUZiYY7JkKVZJXfqsvNvilv5o8A&oe=66157D56",
                                "buttons": [
                                
                                    
                                    {
                                        "type": "postback",
                                        "title": "Quay lại phần dịch vụ",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt lịch khám",
                                        "payload": "RESERVE_TABLE",
                                    }
                                ],
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
};

let goBackToMainMenu = (sender_psid) => {
    sendMainMenu(sender_psid);
};

let goBackToLunchMenu = (sender_psid) => {
    sendLunchMenu(sender_psid);
};

let handleReserveTable = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getFacebookUsername(sender_psid);
            let response = { text: `Hi ${username}, Bạn hay truy cập vào trang web \n\nHoặc liên hệ vào đường dậy nóng: 0972385115 để đặt phòng!` };
             let response1 = { text: `Vui lòng đợi một chút thời gian thêm và chúng tôi sẽ cố gắng liên hệ lại với bạn trong thời gian sớm nhất.\nNếu bạn có bất kỳ câu hỏi hay yêu cầu cụ thể nào, xin đừng ngần ngại để lại tin nhắn và chúng tôi sẽ phản hồi ngay khi có thể.` };
             let response7 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Phòng khám nhi khoa Hoàng Gia",
                                "subtitle": "Phòng khám uy tín dành cho các bạn nhỏ, với các bác sĩ chuyên khoa có kinh nghiệm hàng đầu",
                                "image_url": "https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-6/397879836_122131328654031859_2125483808512469227_n.png?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=caorP7_CGIwAb70s-uQ&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBNACnHdOBdnaipfQYLUZiYY7JkKVZJXfqsvNvilv5o8A&oe=66157D56",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Hiện thị các dịch vụ",
                                        "payload": "MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt phòng khám",
                                        "payload": "RESERVE_TABLE",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Hướng dẫn sủ dụng chat bot này!",
                                        "payload": "GUIDE_BOT",
                                    }
                                ],
                            } ]
                    }
                }
            };
            
             await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response7);
        } catch (e) {
            reject(e);
        }
    });
};

let handleShowRooms = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Giới thiệu về phòng khám",
                                "subtitle": "Mô tả ngắn gọn về phòng khám nhi của bạn, bao gồm tên, địa chỉ và mục tiêu chính của phòng khám.",
                                "image_url": "https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-6/393832479_1507763666657493_3843950732345230644_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=JA2wK_7WT88Ab7Ss4uN&_nc_ht=scontent.fhan5-11.fna&oh=00_AfBNbWZXA9LfHGhhG8d_7x4hAa60Wgdlp8Mlv__KcJe31Q&oe=66169F9B",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Chi tiết phòng khám",
                                        "payload": "SHOW_ROOM_DETAIL",
                                    }
                                ],
                            },
                            {
                                "title": "Dịch vụ cung cấp:",
                                "subtitle": "Liệt kê các dịch vụ y tế cụ thể mà phòng khám nhi của bạn cung cấp cho trẻ em và gia đình...",
                                "image_url": "https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-6/393832479_1507763666657493_3843950732345230644_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=JA2wK_7WT88Ab7Ss4uN&_nc_ht=scontent.fhan5-11.fna&oh=00_AfBNbWZXA9LfHGhhG8d_7x4hAa60Wgdlp8Mlv__KcJe31Q&oe=66169F9B",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Chi tiết dịch vụ",
                                        "payload": "SHOW_ROOM_DETAIL_1",
                                    }
                                ],
                            },
                            {
                                "title": "Đội ngũ y tế và trang thiết bị:",
                                "subtitle": "Mô tả về đội ngũ bác sĩ, y tá và nhân viên y tế khác của phòng khám, cũng như về trang thiết bị y tế hiện đại và tiện nghi.",
                                "image_url": "https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-6/393832479_1507763666657493_3843950732345230644_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=JA2wK_7WT88Ab7Ss4uN&_nc_ht=scontent.fhan5-11.fna&oh=00_AfBNbWZXA9LfHGhhG8d_7x4hAa60Wgdlp8Mlv__KcJe31Q&oe=66169F9B",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Chi tiết đội ngũ y tế ",
                                        "payload": "SHOW_ROOM_DETAIL_2",
                                    }
                                ],
                            },
                            {
                                "title": "Môi trường chăm sóc:",
                                "subtitle": "Mô tả về không gian và môi trường chăm sóc tại phòng khám, bao gồm việc tạo điều kiện an toàn, thoải mái và vui vẻ cho trẻ em.",
                                "image_url": "https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-6/393832479_1507763666657493_3843950732345230644_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=JA2wK_7WT88Ab7Ss4uN&_nc_ht=scontent.fhan5-11.fna&oh=00_AfBNbWZXA9LfHGhhG8d_7x4hAa60Wgdlp8Mlv__KcJe31Q&oe=66169F9B",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Chi tiết môi trường chăm sóc",
                                        "payload": "SHOW_ROOM_DETAIL_3",
                                    }
                                ],
                            },
                            {
                                "title": "Cam kết chất lượng:",
                                "subtitle": "Thể hiện cam kết của phòng khám đối với chất lượng dịch vụ và sự hài lòng của bệnh nhân.",
                                "image_url": "https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-6/393832479_1507763666657493_3843950732345230644_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=JA2wK_7WT88Ab7Ss4uN&_nc_ht=scontent.fhan5-11.fna&oh=00_AfBNbWZXA9LfHGhhG8d_7x4hAa60Wgdlp8Mlv__KcJe31Q&oe=66169F9B",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Chi tiết cam kết chất lượng",
                                        "payload": "SHOW_ROOM_DETAIL_4",
                                    }
                                ],
                            },
                            {
                                "title": "Liên hệ và hướng dẫn: ",
                                "subtitle": "Cung cấp thông tin liên hệ và hướng dẫn để người đọc có thể liên hệ hoặc đến thăm phòng khám của bạn.",
                                "image_url": "https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-6/393832479_1507763666657493_3843950732345230644_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=JA2wK_7WT88Ab7Ss4uN&_nc_ht=scontent.fhan5-11.fna&oh=00_AfBNbWZXA9LfHGhhG8d_7x4hAa60Wgdlp8Mlv__KcJe31Q&oe=66169F9B",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Chi tiết liên hệ",
                                        "payload": "SHOW_ROOM_DETAIL_5",
                                    }
                                ],
                            },

                            {
                                "title": "Quay lại",
                                "image_url": "https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-6/397879836_122131328654031859_2125483808512469227_n.png?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=caorP7_CGIwAb70s-uQ&_nc_ht=scontent.fhan5-2.fna&oh=00_AfBNACnHdOBdnaipfQYLUZiYY7JkKVZJXfqsvNvilv5o8A&oe=66157D56",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Quay lại phần dịch vụ",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt lịch khám",
                                        "payload": "RESERVE_TABLE",
                                    }
                                ],
                            }

                        ]
                    }
                }
            };

            //send a welcome message
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
};

let sendMessageAskingQuality = (sender_id) => {
    let request_body = {
        "recipient": {
            "id": sender_id
        },
        "messaging_type": "RESPONSE",
        "message": {
            "text": "What is your party size ?",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "1-2",
                    "payload": "SMALL",
                }, {
                    "content_type": "text",
                    "title": "2-5",
                    "payload": "MEDIUM",
                },
                {
                    "content_type": "text",
                    "title": "more than 5",
                    "payload": "LARGE",
                }
            ]
        }
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

let sendMessageAskingPhoneNumber = (sender_id) => {
    let request_body = {
        "recipient": {
            "id": sender_id
        },
        "messaging_type": "RESPONSE",
        "message": {
            "text": "Thank you. And what's the best phone number for us to reach you at?",
            "quick_replies": [
                {
                    "content_type": "user_phone_number",
                }
            ]
        }
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

let sendMessageDoneReserveTable = async (sender_id) => {
    try {
        let response = {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://bit.ly/giftDonalTrump"
                }
            }
        };
        await sendTypingOn(sender_id);
        await sendMessage(sender_id, response);

        //get facebook username
        let username = await getFacebookUsername(sender_id);

        //send another message
        let response2 = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": `Done! \nOur reservation team will contact you as soon as possible ${username}.\n \nWould you like to check our Main Menu?`,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "SHOW MAIN MENU",
                            "payload": "MAIN_MENU"
                        },
                        {
                            "type":"phone_number",
                            "title":"☎ HOT LINE",
                            "payload":"+911911"
                        },
                        {
                            "type": "postback",
                            "title": "START OVER",
                            "payload": "RESTART_CONVERSATION"
                        }
                    ]
                }
            }
        };
        await sendTypingOn(sender_id);
        await sendMessage(sender_id, response2);
    } catch (e) {
        console.log(e);
    }
};

let sendNotificationToTelegram = (user) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                chat_id: process.env.TELEGRAM_GROUP_ID,
                parse_mode: "HTML",
                text: `
| --- <b>A new reservation</b> --- |
| ------------------------------------------------|
| 1. Username: <b>${user.name}</b>   |
| 2. Phone number: <b>${user.phoneNumber}</b> |
| 3. Time: <b>${user.time}</b> |
| 4. Quantity: <b>${user.quantity}</b> |
| 5. Created at: ${user.createdAt} |
| ------------------------------------------------ |                           
      `
            };

            // Send the HTTP request to the Telegram
            request({
                "uri": `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let sendMessageDefaultForTheBot = (sender_psid) => {
    return new Promise (async (resolve, reject) => {
        try{
            // let response1 = {
            //     "text": "Bạn có thể tiến hành đặt phòng khám tại phòng khám nhi Hoàng Gia chúng tôi ^^\nVideo này có thể giúp bạn các đặt phòng trên trang web của chúng tôi😉"
            // };
            //send a media template
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "media",
                        "elements": [
                            {
                                "media_type": "video",
                                "url": "https://www.facebook.com/haryphamdev/videos/635394223852656/",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "https://bit.ly/subscribe-haryphamdev",
                                        "title": "Xem thêm video!"
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Bắt đầu!",
                                        "payload": "RESTART_CONVERSATION"
                                    }
                                ]
                            }
                        ]
                    }
                }
            };
            // await sendTypingOn(sender_psid);
            // await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
            resolve("done");
        }catch (e) {
            reject(e);
        }
    });
};

let showRoomDetail = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "text" : "Chào mừng đến với Phòng Khám Nhi của chúng tôi!\nTại Phòng Khám Nhi của chúng tôi, chúng tôi cam kết cung cấp dịch vụ y tế chất lượng và chu đáo cho trẻ em và gia đình. Với đội ngũ bác sĩ và nhân viên y tế giàu kinh nghiệm và tận tâm, chúng tôi cung cấp các dịch vụ kiểm tra sức khỏe định kỳ, điều trị bệnh và tư vấn dinh dưỡng."
            };
            let response2 = {
                "text" : "Với không gian thoải mái và vui vẻ, chúng tôi tạo điều kiện an toàn và thoải mái cho trẻ em, giúp họ cảm thấy thoải mái khi đến phòng khám. Với trang thiết bị y tế hiện đại và tiện nghi, chúng tôi đảm bảo mang lại dịch vụ y tế tốt nhất cho các bé."
            };
            let response3 = {
                "text" : "Hãy đến với Phòng Khám Nhi của chúng tôi để có trải nghiệm chăm sóc sức khỏe tốt nhất cho bé yêu của bạn!"
            };
            
            let response4 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response3);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response4);

            resolve("done!");
        }catch (e) {
            reject(e);
        }
    })
};
let showRoomDetail_1 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "text" : "Tại Phòng Khám Nhi của chúng tôi, chúng tôi tự hào cung cấp một loạt các dịch vụ y tế chuyên sâu dành cho trẻ em và gia đình. Dưới đây là một số dịch vụ chính mà chúng tôi cung cấp:"
            };
            let response2 = {
                "text" : "Kiểm tra sức khỏe định kỳ: Chúng tôi thực hiện các cuộc kiểm tra sức khỏe định kỳ để đảm bảo sự phát triển toàn diện và sức khỏe tốt nhất cho trẻ em."
            };
            let response3 = {
                "text" : "Chẩn đoán và điều trị bệnh: Đội ngũ bác sĩ giàu kinh nghiệm của chúng tôi sẵn lòng giúp đỡ và điều trị mọi vấn đề sức khỏe của trẻ, từ các vấn đề nhỏ như cảm lạnh đến các vấn đề phức tạp hơn."
            };
            let response4 = {
                "text" : "Tư vấn dinh dưỡng: Chúng tôi cung cấp tư vấn dinh dưỡng chuyên sâu để giúp trẻ em và gia đình hiểu rõ hơn về cách duy trì một lối sống ăn uống lành mạnh và cân bằng."
            };
            let response5 = {
                "text" : "Chăm sóc trẻ sơ sinh: Chúng tôi cung cấp các dịch vụ chăm sóc đặc biệt cho trẻ sơ sinh, bao gồm kiểm tra sức khỏe, tư vấn cho việc nuôi con và giáo dục sức khỏe."
            };
            let response6 = {
                "text" : "Chăm sóc bệnh nhiều hơn: Ngoài ra, chúng tôi còn cung cấp một loạt các dịch vụ khác như tiêm phòng, chăm sóc vấn đề da liễu và tư vấn về sức khỏe tâm thần"
            };
            let response7 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response3);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response4);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response5);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response6);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response7);

            resolve("done!");
        }catch (e) {
            reject(e);
        }
    })
};

let showRoomDetail_2 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "text" : "Đội ngũ y tế: Tại Phòng Khám Nhi của chúng tôi, chúng tôi tự hào có đội ngũ bác sĩ, y tá và nhân viên y tế giàu kinh nghiệm và tận tâm. Bác sĩ của chúng tôi không chỉ có kiến thức chuyên môn vững vàng mà còn có tinh thần chăm sóc tận tụy đối với trẻ em. Họ luôn sẵn lòng lắng nghe và giúp đỡ các bậc phụ huynh trong việc chăm sóc sức khỏe của trẻ."
            };
            let response2 = {
                "text" : "Trang thiết bị y tế: Chúng tôi sở hữu các trang thiết bị y tế hiện đại và tiên tiến nhất để đảm bảo chẩn đoán chính xác và điều trị hiệu quả cho trẻ em. Từ máy đo nhiệt độ đến máy siêu âm và máy X-quang, chúng tôi đảm bảo mọi dịch vụ được thực hiện với chất lượng cao nhất và mức độ an toàn tuyệt đối."
            };
            
            let response7 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
           
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response7);

            resolve("done!");
        }catch (e) {
            reject(e);
        }
    })
};
let showRoomDetail_3 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "text" : "Môi trường chăm sóc: Tại Phòng Khám Nhi của chúng tôi, chúng tôi tạo ra một môi trường chăm sóc ấm cúng và thoải mái cho trẻ em và gia đình. Không gian được thiết kế rộng rãi và trang nhã, tạo điều kiện thuận lợi cho sự di chuyển và thoải mái của trẻ em."
            };
            let response2 = {
                "text" : "Môi trường an toàn: Chúng tôi luôn ưu tiên an toàn của trẻ em. Mọi thiết bị y tế và đồ chơi trong phòng khám đều được kiểm tra đảm bảo an toàn và vệ sinh tuyệt đối."
            };
            let response3 = {
                "text" : "Môi trường vui vẻ: Chúng tôi tin rằng việc tạo ra một môi trường vui vẻ và tích cực sẽ giúp trẻ em cảm thấy thoải mái và tự tin hơn khi đến phòng khám. Vì vậy, chúng tôi cung cấp các góc chơi vui nhộn và màu sắc, cũng như các hoạt động giải trí phù hợp với mọi độ tuổi."
            };
            let response4 = {
                "text" : "Môi trường tương tác: Đội ngũ y tế của chúng tôi không chỉ là những người chuyên môn mà còn là những người bạn đồng hành tin cậy của trẻ em. Chúng tôi luôn tạo điều kiện cho sự tương tác gần gũi và thân thiện, giúp trẻ em cảm thấy thoải mái và được quan tâm.."
            };
            let response5 = {
                "text" : "Chúng tôi cam kết tạo ra một môi trường chăm sóc tốt nhất cho trẻ em và gia đình. Hãy đến với Phòng Khám Nhi của chúng tôi để trải nghiệm không gian chăm sóc ấm áp và chuyên nghiệp nhất!"
            };
            let response7 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response3);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response4);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response5);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response7);

            resolve("done!");
        }catch (e) {
            reject(e);
        }
    })
};

let showRoomDetail_4 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "text" : "Cam kết chất lượng: Tại Phòng Khám Nhi của chúng tôi, chất lượng là ưu tiên hàng đầu trong mọi dịch vụ mà chúng tôi cung cấp. Chúng tôi cam kết:"
            };
            let response2 = {
                "text" : "Chất lượng y tế: Đội ngũ y tế giàu kinh nghiệm của chúng tôi luôn đảm bảo chất lượng cao nhất trong mọi dịch vụ y tế, từ kiểm tra sức khỏe đến chẩn đoán và điều trị bệnh."
            };
            let response3 = {
                "text" : "Chăm sóc tận tâm: Chúng tôi cam kết cung cấp sự chăm sóc tận tâm và chu đáo nhất cho trẻ em và gia đình. Đội ngũ y tế của chúng tôi luôn lắng nghe và tôn trọng mọi nhu cầu và quan ngại của bệnh nhân."
            };
            let response4 = {
                "text" : "Môi trường tương tác: Đội ngũ y tế của chúng tôi không chỉ là những người chuyên môn mà còn là những người bạn đồng hành tin cậy của trẻ em. Chúng tôi luôn tạo điều kiện cho sự tương tác gần gũi và thân thiện, giúp trẻ em cảm thấy thoải mái và được quan tâm."
            };
            let response5 = {
                "text" : "An toàn và vệ sinh: Chúng tôi tuân thủ mọi quy định về an toàn và vệ sinh y tế để đảm bảo môi trường chăm sóc an toàn và sạch sẽ nhất cho trẻ em và gia đình."
            };
            let response6 = {
                "text" : "Tính minh bạch và công bằng: Chúng tôi cam kết thông tin minh bạch và công bằng đối với mọi bệnh nhân, bao gồm cả quy trình điều trị, chi phí và kế hoạch chăm sóc."
            };
            let response7 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response3);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response4);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response5);
             await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response6);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response7);

            resolve("done!");
        }catch (e) {
            reject(e);
        }
    })
};
let showRoomDetail_5 = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "text" : "Phòng khám nhi khoa Hoàng Gia\nHotline 0972385115\n203 - Hoàng Gia- Tổ 6- Tân Thịnh- Thái Nguyên"
            };
            let response7 = {
                 "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại thông tin dịch vụ hoặc đặt phòng khám?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thông tin dịch vụ",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt phòng khám",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
             };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
        
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response7);

            resolve("done!");
        }catch (e) {
            reject(e);
        }
    })
};



let sendSalad = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": URL_SALAD_GIF
                    }
                }
            };
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Entree Salad \n$25.00`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            resolve("done");
        }catch (e) {
            reject(e);
        }
    });
};

let sendFish = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": URL_SHOW_FISH
                    }
                }
            };
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Fish fry \n$60.00`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            resolve("done");
        }catch (e) {
            reject(e);
        }
    });
};

let sendClassic = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": URL_SHOW_CLASSIC
                    }
                }
            };
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Perfect oven baked fries \n$30.00`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            resolve("done");
        }catch (e) {
            reject(e);
        }
    });
};

let sendMessage = (sender_psid, response) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response,
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                console.log(res)
                console.log(body)
                if (!err) {
                    console.log("message sent!");
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let sendTypingOn = (sender_psid) => {
    return new Promise ((resolve, reject) => {
       try{
           let request_body = {
               "recipient": {
                   "id": sender_psid
               },
               "sender_action":"typing_on"
           };

           // Send the HTTP request to the Messenger Platform
           request({
               "uri": "https://graph.facebook.com/v6.0/me/messages",
               "qs": { "access_token": PAGE_ACCESS_TOKEN },
               "method": "POST",
               "json": request_body
           }, (err, res, body) => {
               if (!err) {
                   resolve('done!')
               } else {
                   reject("Unable to send message:" + err);
               }
           });
       } catch (e) {
           reject(e);
       }
    });
};

let markMessageSeen = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "sender_action":"mark_seen"
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        }catch (e) {
          reject(e);
        }
    });
};

module.exports = {
    getFacebookUsername: getFacebookUsername,
    sendResponseWelcomeNewCustomer: sendResponseWelcomeNewCustomer,
    sendMainMenu: sendMainMenu,
    sendLunchMenu: sendLunchMenu,
    sendDinnerMenu: sendDinnerMenu,
    sendPubMenu: sendPubMenu,
    sendAppetizer: sendAppetizer,
    goBackToMainMenu: goBackToMainMenu,
    goBackToLunchMenu: goBackToLunchMenu,
    handleReserveTable: handleReserveTable,
    handleShowRooms: handleShowRooms,
    sendMessageAskingQuality: sendMessageAskingQuality,
    sendMessageAskingPhoneNumber: sendMessageAskingPhoneNumber,
    sendMessageDoneReserveTable: sendMessageDoneReserveTable,
    sendNotificationToTelegram: sendNotificationToTelegram,
    sendMessageDefaultForTheBot:sendMessageDefaultForTheBot,
    showRoomDetail: showRoomDetail,
    showRoomDetail_1: showRoomDetail_1,
    showRoomDetail_2: showRoomDetail_2,
    showRoomDetail_3: showRoomDetail_3,
    showRoomDetail_4: showRoomDetail_4,
    showRoomDetail_5: showRoomDetail_5,
    sendSalad: sendSalad,
    sendFish: sendFish,
    sendClassic:sendClassic,
    markMessageSeen: markMessageSeen,
    sendTypingOn: sendTypingOn,
    sendMessage: sendMessage,
    sendReply: sendReply,
    sendReply_1: sendReply_1,
    sendReply_2: sendReply_2,
    sendReply_3: sendReply_3,
    sendReply_4: sendReply_4,
    sendReply_5: sendReply_5,
    sendReply_6: sendReply_6,
    setupProfile: setupProfile

};