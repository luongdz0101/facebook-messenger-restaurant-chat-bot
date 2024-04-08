import homepageService from "../services/homepageService";
require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getHomepage = (req, res) => {
    let fbPageId = process.env.PAGE_ID;
    return res.render("homepage.ejs",{
        fbPageId
    });
};

let getFacebookUserProfile = (req, res) => {
    return res.render("profile.ejs");
};

let setUpUserFacebookProfile = async (req, res) => {
    // Send the HTTP request to the Messenger Platform
    try{
        await homepageService.setUpMessengerPlatform(PAGE_ACCESS_TOKEN);
        return res.status(200).json({
            message: "OK"
        });
    }catch (e) {
        return res.status(500).json({
            "message": "Error from the node server"
        })
    }
};


let handleReserveTable = (req, res) => {
    return res.render("reserve-table.ejs")
};

let handlePostReserveTable = async(req, res) => {
    try {
        let customerName = "";
        if (req.body.customerName === "") {
            customerName = "Để trống";
        } else customerName = req.body.customerName;

        // I demo response with sample text
        // you can check database for customer order's status

        let response1 = {
            "text": `---Thông tin khách hàng đặt phòng khám---
            \nHọ và tên: ${customerName}
            \nĐịa trỉ email: ${req.body.email}
            \nSố điện thoại: ${req.body.orderNumber}
            `
        };

        await chatBotController.callSendAPI(req.body.psid, response1);

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
         
        console.log('Loi post')
        return res.status(500).json({
            message: "Server error"
        });
    }
};



module.exports = {
    getHomepage: getHomepage,
    getFacebookUserProfile: getFacebookUserProfile,
    setUpUserFacebookProfile: setUpUserFacebookProfile,
    handleReserveTable: handleReserveTable,
    handlePostReserveTable: handlePostReserveTable
};