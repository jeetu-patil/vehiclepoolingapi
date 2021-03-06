const PublishRide = require("../model/PublishRide");
const BookerHistory = require("../model/BookerHistory");
const { validationResult } = require("express-validator");
const User = require("../model/User");
const cloudinary = require("cloudinary");
const BookRide = require("../model/BookRide");
const otpGenerator = require("otp-generator");
const Vonage = require("@vonage/server-sdk");
const vonage = new Vonage({
  apiKey: "24b6f39f",
  apiSecret: "uZRuodZOJy4ov4KG",
});
cloudinary.config({
  cloud_name: "dfhuhxrw3",
  api_key: "212453663814245",
  api_secret: "zzSd8ptSYG-MS7hRnE-Ab46Bmts",
});

//check it is first ride or not
exports.checkUserRidePublish = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });
  if (!request.body.id) return response.status(500).json({ msg: "error" });

  User.findOne({ _id: request.body.id })
    .then((result) => {
      if (result.publishRideCount > 0)
        return response.status(200).json({ result: result, count: 1 });
      return response.status(200).json({ result: result, count: 0 });
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
};

//if it is first ride then he/she fill some detail one time
exports.firstPublishRide = async (request, response) => {
  const errors = validationResult(request);
  console.log(errors);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });

  let vehicleImage = "";
  if (request.file) {
    var result = await cloudinary.v2.uploader.upload(request.file.path);
    vehicleImage = result.url;
  } else vehicleImage = request.body.imageUrl;
  console.log("Url image" + vehicleImage);
  let vechile = {
    name: request.body.name,
    number: request.body.number,
    image: vehicleImage,
    wheeler: request.body.wheeler,
  };
  User.updateOne(
    { _id: request.body.userId },
    {
      vehicle: vechile,
    }
  )
    .then((result) => {
      return response.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json(err);
    });
};

//here publisher pusblish ride
exports.publishRide = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });

  let check = await PublishRide.findOne({
    fromId: request.body.fromId,
    toId: request.body.toId,
    rideDate: datum,
    publisherId: request.body.publisherId,
  });

  if (check) return response.status(200).json({ msg: "check-failed" });

  if (request.body.rideType == "daily") {
    var data;
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    var datum = Date.parse(request.body.rideDate + "," + request.body.rideTime);
    PublishRide.create({
      publisherId: request.body.publisherId,
      fromId: request.body.fromId,
      toId: request.body.toId,
      rideDate: datum,
      seatAvailable: request.body.seatAvailable,
      distance: request.body.distance,
      totalAmount: 0,
      amountPerPerson: request.body.amountPerPerson,
      isBooked: false,
      totalSeat: request.body.seatAvailable,
      msgForBooker: request.body.msgForBooker,
      rideType: request.body.rideType,
      rideendDate:datum
    })
      .then((result) => {
        data = result;
        User.findOne({ _id: request.body.publisherId })
          .then((result) => {
            User.updateOne(
              { _id: request.body.publisherId },
              {
                publishRideCount: result.publishRideCount + 1,
              }
            )
              .then((result) => {
                return response.status(200).json(data);
              })
              .catch((err) => {
                return response.status(500).json(err);
              });
          })
          .catch((error) => {
            return response.status(500).json(err);
          });
      })
      .catch((err) => {
        return response.status(500).json(err);
      });
  } else if (request.body.rideType == "weekly") {
    var data;
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      (today.getDate() + 7);
      var datum = Date.parse(request.body.rideDate + "," + request.body.rideTime);
    PublishRide.create({
      publisherId: request.body.publisherId,
      fromId: request.body.fromId,
      toId: request.body.toId,
      rideDate: datum,
      seatAvailable: request.body.seatAvailable,
      distance: request.body.distance,
      totalAmount: 0,
      amountPerPerson: request.body.amountPerPerson,
      isBooked: false,
      totalSeat: request.body.seatAvailable,
      msgForBooker: request.body.msgForBooker,
      rideType: request.body.rideType,
      rideendDate: Date.parse(date),
    })
      .then((result) => {
        data = result;
        User.findOne({ _id: request.body.publisherId })
          .then((result) => {
            User.updateOne(
              { _id: request.body.publisherId },
              {
                publishRideCount: result.publishRideCount + 1,
              }
            )
              .then((result) => {
                return response.status(200).json(data);
              })
              .catch((err) => {
                return response.status(500).json(err);
              });
          })
          .catch((error) => {
            return response.status(500).json(err);
          });
      })
      .catch((err) => {
        return response.status(500).json(err);
      });

    var datum = Date.parse(request.body.rideDate + "," + request.body.rideTime);
  } else if (request.body.rideType == "monthly") {
    var data;
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 2) +
      "-" +
      today.getDate();
    var datum = Date.parse(request.body.rideDate + "," + request.body.rideTime);

    PublishRide.create({
      publisherId: request.body.publisherId,
      fromId: request.body.fromId,
      toId: request.body.toId,
      rideDate: datum,
      seatAvailable: request.body.seatAvailable,
      distance: request.body.distance,
      totalAmount: 0,
      amountPerPerson: request.body.amountPerPerson,
      isBooked: false,
      totalSeat: request.body.seatAvailable,
      msgForBooker: request.body.msgForBooker,
      rideType: request.body.rideType,
      rideendDate: Date.parse(date),
    })
      .then((result) => {
        data = result;
        User.findOne({ _id: request.body.publisherId })
          .then((result) => {
            User.updateOne(
              { _id: request.body.publisherId },
              {
                publishRideCount: result.publishRideCount + 1,
              }
            )
              .then((result) => {
                return response.status(200).json(data);
              })
              .catch((err) => {
                return response.status(500).json(err);
              });
          })
          .catch((error) => {
            return response.status(500).json(err);
          });
      })
      .catch((err) => {
        return response.status(500).json(err);
      });
  }
};

//here booker request to the publisher
exports.requestForPublisher = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });
  let obj = {
    userId: request.body.bookerId,
    bookRideId: request.body.bookRideId,
  };
  let result = await PublishRide.findOne({ _id: request.body.rideId });
  result.publisherRequest.push(obj);
  console.log(obj);
  await result
    .save()
    .then((result) => {
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
};

//here we display all available publisher
exports.allPublishRidesForUser = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });
  let publish = await PublishRide.find({
    isTimeExpired: false,
    isBooked: false,
    rideendDate: { $gt: Date.now() },
    isCancelled: false,
    seatAvailable: { $gt: 0 },
  })
    .sort({ date: "desc" })
    .populate("publisherId")
    .populate("fromId")
    .populate("toId");

  let publish1 = await PublishRide.find({
    isTimeExpired: false,
    isBooked: false,
    isCancelled: false,
  });

  for (var i = 0; i < publish1.length; i++) {
    if (publish1[i].rideendDate < Date.now()) {
      await PublishRide.updateOne(
        { _id: publish1[i]._id },
        {
          $set: {
            isTimeExpired: true,
            publisherRequest: [],
          },
        }
      );
    }
  }
  return response.status(200).json(publish);
};

//here get all publish rides of particular user
exports.getPublishRidesOfSingle = async (request, response) => {
  console.log(request.body)
  let temp = [];
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });

  // let answer = await PublishRide.find({
  //   publisherId: request.body.publisherId,
  //   isBooked: false,
  //   rideendDate: { $gt: Date.now() },
  //   isCancelled: false,
  //   seatAvailable: { $gt: 0 },
  // }).populate("publisherRequest")
  // .populate("fromId")
  // .populate("toId");

  await PublishRide.find({
    publisherId: request.body.publisherId,
    isBooked: false,
    rideendDate: { $gt: Date.now() },
    isCancelled: false,
    seatAvailable: { $gt: 0 }
  })
    .populate("publisherRequest")
    .populate("fromId")
    .populate("toId")
    .then((result) => {
      // for (var i = 0; i < answer.length; i++) {
      //   if (answer[i].rideendDate > Date.now()) {
      //     result[result.length] = answer[i];
      //   }
      // }
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
};

//showing request to the publisher
exports.showRequestToThePublisher = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });
  PublishRide.findOne({
    publisherId: request.body.publisherId,
    _id: request.body.rideId,
  })
    .populate("publisherRequest.userId")
    .populate("fromId")
    .populate("toId")
    .then((result) => {
      return response.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json(err);
    });
};

//if publisher decline request of booker
exports.declineRequestOfBooker = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });

  console.log(request.body);

  User.findOne({ _id: request.body.bookerId })
    .then(async (result) => {
      const from = "RideSharely";
      const to = "91" + result.mobile;
      const text =
        "Your Request for the ride is declined by the publisher . Please find other ride . Sorry for the inconvenience";
      await vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
          console.log(err);
        } else {
          if (responseData.messages[0]["status"] === "0") {
            console.log("Message sent successfully.");
          } else {
            console.log(
              `Message failed with error: ${responseData.messages[0]["error-text"]}`
            );
          }
        }
      });

      PublishRide.findOne({ _id: request.body.rideId })
        .then((answer) => {
          let pr = answer.publisherRequest;
          let bookRideId;
          let index;
          for (let i = 0; i < pr.length; i++) {
            if (pr[i].userId == request.body.bookerId) {
              bookRideId = pr[i].bookRideId;
              index = i;
              break;
            }
          }

          answer.publisherRequest.splice(index, 1);
          answer
            .save()
            .then(async (result) => {
              await BookRide.deleteOne({ _id: bookRideId })
                .then((result) => {
                  return response.status(200).json(result);
                })
                .catch((err) => {
                  console.log(error);
                  return response.status(500).json(err);
                });
            })
            .catch((err) => {
              console.log(err);
              return response.status(500).json(err);
            });
        })
        .catch((error) => {
          console.log(error);
          return response.status(500).json(error);
        });
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
};

//if publisher accept booker request
exports.acceptRequestOfBooker = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });

  let publishRider = await PublishRide.findOne({
    publisherId: request.body.publisherId,
    _id: request.body.rideId,
  }).populate("publisherId");
  let booker = await BookRide.findOne({
    _id: request.body.bookRideId,
  }).populate("bookerId");

  console.log("hiii" + (publishRider.seatAvailable - booker.seatWant));
  if (publishRider.seatAvailable > 0) {
    PublishRide.updateOne(
      { _id: request.body.rideId },
      {
        seatAvailable: publishRider.seatAvailable - booker.seatWant,
      }
    )
      .then(async (result) => {
        console.log(result);
        let otp = otpGenerator.generate(4, {
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        console.log("OTP : " + otp);
        const from = "RideSharely";
        const to = "91" + booker.bookerId.mobile;
        console.log(to);
        const text =
          "Your request for the ride is accepted . OTP for the ride is " +
          otp +
          " .  Publisher Name : " +
          publishRider.publisherId.name +
          ", Contact: " +
          publishRider.publisherId.mobile +
          ", Vehicle no.: " +
          publishRider.publisherId.vehicle.number;

        await vonage.message.sendSms(from, to, text, (err, responseData) => {
          if (err) {
            console.log(err);
          } else {
            if (responseData.messages[0]["status"] === "0") {
              console.log("Message sent successfully.");
            } else {
              console.log(
                `Message failed with error: ${responseData.messages[0]["error-text"]}`
              );
            }
          }
        });

        let tempOtp = {
          bookerId: request.body.bookerId,
          otpNumber: otp,
          bookRideId: request.body.bookRideId,
        };

        let a = await PublishRide.findOne({ _id: request.body.rideId });
        a.otp.push(tempOtp);
        await a.save();

        await BookRide.updateOne(
          { _id: request.body.bookRideId },
          {
            publisherId: request.body.publisherId,
            totalAmount: booker.seatWant * publishRider.amountPerPerson,
            isAccepted: true,
          }
        )
          .then()
          .catch((err) => {
            console.log(err);
          });

        await PublishRide.updateOne(
          { _id: request.body.rideId },
          {
            totalAmount:
              booker.seatWant * publishRider.amountPerPerson +
              publishRider.totalAmount,
          }
        )
          .then()
          .catch((err) => {
            console.log(err);
          });

        if (publishRider.seatAvailable > 0) {
          let result = await PublishRide.findOne({
            _id: request.body.rideId,
          });
          result.historyOfUser.push(request.body.bookerId);
          result.save();

          PublishRide.findOne({ _id: request.body.rideId }).then((answer) => {
            let pr = answer.publisherRequest;
            let index;
            for (let i = 0; i < pr.length; i++) {
              if (pr[i].userId == request.body.bookerId) {
                index = i;
                break;
              }
            }
            answer.publisherRequest.splice(index, 1);
            answer.save();
          });
          publishRider = await PublishRide.findOne({
            publisherId: request.body.publisherId,
            _id: request.body.rideId,
          });
          if (publishRider.seatAvailable <= 0) {
            await PublishRide.updateOne(
              { _id: request.body.rideId },
              {
                $set: {
                  isBooked: true,
                  publisherRequest: [],
                },
              }
            );
          }
        }
        return response
          .status(200)
          .json({ msg: "Your ride is confirmed with " });
      })
      .catch((err) => {
        console.log(err);
        return response.status(500).json(err);
      });
  }
};

//showing all accept user by publisher
exports.showAllAcceptRequestByPublisher = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });
  PublishRide.findOne({ _id: request.body.rideId })
    .populate("otp.bookerId")
    .then((result) => {
      console.log(result);
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
};

//match otp which provide by user to the publisher
exports.matchOtp = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });
  var status = false;
  var publisher = await PublishRide.findOne({ _id: request.body.rideId });
  var bookerId;
  var bookRideId;
  var id;
  for (var i = 0; i < publisher.otp.length; i++) {
    t = parseInt(request.body.otp);
    if (t == publisher.otp[i].otpNumber) {
      status = true;
      bookerId = publisher.otp[i].bookerId;
      bookRideId = publisher.otp[i].bookRideId;
      id = publisher.otp[i]._id;
      break;
    }
  }

  if (status) {
    await BookRide.deleteOne({ _id: bookRideId });

    publisher.otp.pull(id);
    publisher
      .save()
      .then(async (result) => {
        await BookerHistory.findOne({ bookerId: bookerId })
          .then((bh) => {
            if (!bh) {
              bh = new BookerHistory();
              bh.bookerId = bookerId;
            }
            bh.publisherId.push(request.body.publisherId);
            bh.save()
              .then(async (result) => {
                await BookRide.deleteOne({ _id: request.body.id });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {});
        return response.status(200).json({ msg: "Success" });
      })
      .catch((error) => {
        console.log(error);
        return response.status(500).json(error);
      });
  }
};

//if publisher cancel ride
exports.cancelRide = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });
  let pr = await PublishRide.findOne({ _id: request.body.rideId })
    .populate("publisherRequest")
    .populate("otp.bookerId");

  let otp = pr.otp;
  let publisherRequest = pr.publisherRequest;
  let temp = [];
  let status = false;
  let i,
    k = 0;

  for (i = 0; i < publisherRequest.length; i++)
    temp[i] = publisherRequest[i].userId.mobile;

  for (k = 0; k < otp.length; i++, k++) temp[i] = otp[k].bookerId.mobile;

  await PublishRide.updateOne(
    { _id: request.body.rideId },
    {
      $set: {
        isCancelled: true,
        publisherRequest: [],
      },
    }
  )
    .then(() => {})
    .catch((error) => {
      console.error(error);
    });

  for (i = 0; i < publisherRequest.length; i++) {
    await BookRide.deleteOne({ _id: publisherRequest[i].bookRideId })
      .then(() => {
        status = true;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  for (i = 0; i < otp.length; i++) {
    await BookRide.deleteOne({ _id: otp[i].bookRideId })
      .then(() => {
        status = true;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  for (let i = 0; i < temp.length; i++) {
    const from = "RideSharely";
    const to = "91" + temp[i];
    console.log(to);
    const text =
      "Your ride is cancelled by the publisher due to some reason. Please find another ride . Sorry for the incovenience";
    await vonage.message.sendSms(from, to, text, (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        if (responseData.messages[0]["status"] === "0") {
          console.log("Message sent successfully.");
        } else {
          console.log(
            `Message failed with error: ${responseData.messages[0]["error-text"]}`
          );
        }
      }
    });
  }

  if (status) return response.status(200).json({ msg: "cancel" });
};

//Here we fetch particular ride
exports.getParticualRideRequest = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });
  PublishRide.findOne({ _id: request.body.id })
    .populate("publisherId")
    .populate("fromId")
    .populate("toId")
    .then((result) => {
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
};

//all rides for booker according to date
exports.getRidesForBooker = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });
  statusRide = false;
  totalRides = [];

  if (request.body.rideType == "daily") {
    PublishRide.find({
      fromId: request.body.from,
      toId: request.body.to,
      rideDate: { $gt: Date.now() },
      isCancelled: false,
      seatAvailable: { $gt: 0 },
    })
      .populate("publisherId")
      .populate("fromId")
      .populate("toId")
      .then((rides) => {
        console.log("ID1 : " + rides.length);
        if (rides.length > 0) {
          for (let i = 0; i < rides.length; i++) {
            const d = new Date(rides[i].rideDate * 1);
            let date = d.toDateString();
            if (
              date == new Date(request.body.date).toDateString() &&
              rides[i].seatAvailable >= request.body.seat
            ) {
              statusRide = true;
              totalRides[i] = rides[i];
            }
          }
          if (statusRide) return response.status(200).json(totalRides);
        }
        return response.status(200).json(totalRides);
      })
      .catch((err) => {
        console.log(err);
        return response.status(500).json(err);
      });
  } else {
    PublishRide.find({
      fromId: request.body.from,
      toId: request.body.to,
      rideType: request.body.rideType,
      rideendDate: { $gt: Date.now() },
      isCancelled: false,
      seatAvailable: { $gt: 0 },
    })
      .populate("publisherId")
      .populate("fromId")
      .populate("toId")
      .then((rides) => {
        if (rides.length > 0) {
          for (let i = 0; i < rides.length; i++) {
            if (rides[i].seatAvailable >= request.body.seat) {
              statusRide = true;
              totalRides[i] = rides[i];
            }
          }
          if (statusRide) return response.status(200).json(totalRides);
        }
        return response.status(200).json(totalRides);
      })
      .catch((err) => {
        console.log(err);
        return response.status(500).json(err);
      });
  }
};

//if cancell by booker
exports.cancelRideByBooker = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });
  let i;
  let publisher = await PublishRide.findOne({
    _id: request.body.rideId,
  }).populate("publisherId");
  let booker = await BookRide.findOne({ _id: request.body.bookRideId });
  publisher.historyOfUser.pull(request.body.bookerId);
  publisher.save();

  for (i = 0; publisher.otp.length; i++) {
    if (publisher.otp[i].bookerId == request.body.bookerId) break;
  }

  publisher = await PublishRide.findOne({
    _id: request.body.rideId,
  }).populate("publisherId");
  publisher.otp.splice(i, 1);
  publisher.save();

  await BookRide.deleteOne({ _id: request.body.bookRideId });

  PublishRide.updateOne(
    { _id: request.body.rideId },
    {
      seatAvailable: booker.seatWant + publisher.seatAvailable,
      isBooked: false,
    }
  )
    .then(async (result) => {
      const from = "RideSharely";
      const to = "91" + publisher.publisherId.mobile;
      console.log(to);
      const text =
        "Your ride is cancelled by the booker due to some reason. Your currently available seat is " +
        (booker.seatWant + publisher.seatAvailable);
      await vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
          console.log(err);
        } else {
          if (responseData.messages[0]["status"] === "0") {
            console.log("Message sent successfully.");
          } else {
            console.log(
              `Message failed with error: ${responseData.messages[0]["error-text"]}`
            );
          }
        }
      });
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
};

exports.cancelBooker = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });

  let publishRide = await PublishRide.findOne({ _id: request.body.rideId });
  let Booker = await BookRide.findOne({ _id: request.body.bookRideId });

  var i;
  let historyOfUser = publishRide.historyOfUser;
  for (i = 0; i < historyOfUser.length; i++) {
    if (historyOfUser[i] == request.body.bookerId) break;
  }
  publishRide.historyOfUser.splice(i - 1, 1);

  for (i = 0; i < publishRide.otp[i].bookerId.length; i++) {
    if (publishRide.otp[i].bookerId == request.body.bookerId) break;
  }
  publishRide.otp.splice(i - 1, 1);

  await publishRide.save();

  await PublishRide.updateOne(
    { _id: request.body.rideId },
    {
      seatAvailable: publishRide.seatAvailable + Booker.seatWant,
    }
  );

  BookRide.deleteOne({ _id: request.body.bookRideId })
    .then((result) => {
      return response.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
