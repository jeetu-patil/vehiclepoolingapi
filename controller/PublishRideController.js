const PublishRide = require("../model/PublishRide");
const BookerHistory = require("../model/BookerHistory");
const { validationResult } = require("express-validator");
const User = require("../model/User");
const cloudinary = require("cloudinary");
const BookRide = require("../model/BookRide");
const otpGenerator = require("otp-generator");
const fast2sms = require("fast-two-sms");

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
  User.findOne({ _id: request.params.id })
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
  if (!errors.isEmpty())
    return response.status(400).json({ errors: errors.array() });
  let vehicleImage = "";
  if (request.file) {
    var result = await cloudinary.v2.uploader.upload(request.file.path);
    vehicleImage = result.url;
  }

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
exports.publishRide = (request, response) => {
  var data;
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  var datum = Date.parse(
    request.body.rideDate + "," + request.body.rideTime + ":00"
  );

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
    ridePublishDate: date,
    totalSeat: request.body.seatAvailable,
    msgForBooker: request.body.msgForBooker,
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
};

//here booker request to the publisher
exports.requestForPublisher = async (request, response) => {
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
  let publish = await PublishRide.find({
    isTimeExpired: false,
    isBooked: false,
    rideDate: { $gt: Date.now() },
    isCancelled: false,
  })
    .sort({ date: "desc" })
    .populate("publisherId")
    .populate("fromId")
    .populate("toId");

  let publish1=await PublishRide.find({
    isTimeExpired: false,
    isBooked: false,
    isCancelled: false,
  });

  for (var i = 0; i < publish1.length; i++) {
    console.log(typeof(publish1[i].rideDate)+"<"+typeof(Date.now().toString()))
    if (publish1[i].rideDate < Date.now()) {
      console.log("Successs"+publish1[i]._id);
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
  await PublishRide.find({
    publisherId: request.params.publisherId,
    isBooked: false,
    rideDate: { $gt: Date.now() },
    isCancelled: false,
  })
    .populate("publisherRequest")
    .populate("fromId")
    .populate("toId")
    .then((result) => {
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
};

//showing request to the publisher
exports.showRequestToThePublisher = (request, response) => {
  PublishRide.findOne({
    publisherId: request.params.publisherId,
    _id: request.params.rideId,
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
  User.findOne({ _id: request.params.bookerId })
    .then(async (result) => {
      console.log(result.mobile);
      var option = {
        authorization:
          "kAHrGWQ7EdUgB5sR6ehbCyLJuTnX82iPOc1pYZl9Sw0mzjvoK4fcXF9uO3AbhYdaBke2EVZWjLlPCyTz",
        message: "Your Request For The Ride Is Declined Please Find Other Ride",
        numbers: [result.mobile],
      };
      await fast2sms.sendMessage(option);

      PublishRide.findOne({ _id: request.params.rideId })
        .then((answer) => {
          let pr = answer.publisherRequest;
          let bookRideId;
          let index;
          for (let i = 0; i < pr.length; i++) {
            if (pr[i].userId == request.params.bookerId) {
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
  let publishRider = await PublishRide.findOne({
    publisherId: request.params.publisherId,
    _id: request.params.rideId,
  }).populate("publisherId");
  let booker = await BookRide.findOne({
    _id: request.params.bookRideId,
  }).populate("bookerId");
  console.log(
    booker.seatWant,
    publishRider.amountPerPerson,
    publishRider.totalAmount
  );
  if (publishRider.seatAvailable > 0) {
    PublishRide.updateOne(
      { _id: request.params.rideId },
      {
        seatAvailable: publishRider.seatAvailable - booker.seatWant,
      }
    )
      .then(async (result) => {
        let otp = otpGenerator.generate(4, {
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        var option = {
          authorization:
            "kAHrGWQ7EdUgB5sR6ehbCyLJuTnX82iPOc1pYZl9Sw0mzjvoK4fcXF9uO3AbhYdaBke2EVZWjLlPCyTz",
          message:
            " " +
            otp +
            " : " +
            publishRider.name +
            " , Mobile : " +
            publishRider.mobile +
            ",Vehcile Number :  " +
            publishRider.publisherId.vehicle.number,
          numbers: [booker.bookerId.mobile],
        };
        await fast2sms.sendMessage(option);

        let tempOtp = {
          bookerId: request.params.bookerId,
          otpNumber: otp,
          bookRideId: request.params.bookRideId,
        };

        let a = await PublishRide.findOne({ _id: request.params.rideId });
        a.otp.push(tempOtp);
        await a.save();

        await BookRide.updateOne(
          { _id: request.params.bookRideId },
          {
            publisherId: request.params.publisherId,
            totalAmount: booker.seatWant * publishRider.amountPerPerson,
            isAccepted: true,
          }
        )
          .then()
          .catch((err) => {
            console.log(err);
          });

        await PublishRide.updateOne(
          { _id: request.params.rideId },
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
            _id: request.params.rideId,
          });
          result.historyOfUser.push(request.params.bookerId);
          result.save();

          PublishRide.findOne({ _id: request.params.rideId }).then((answer) => {
            let pr = answer.publisherRequest;
            let index;
            for (let i = 0; i < pr.length; i++) {
              if (pr[i].userId == request.params.bookerId) {
                index = i;
                break;
              }
            }
            answer.publisherRequest.splice(index, 1);
            answer.save();
          });
          publishRider = await PublishRide.findOne({
            publisherId: request.params.publisherId,
            _id: request.params.rideId,
          });
          if (publishRider.seatAvailable <= 0) {
            await PublishRide.updateOne(
              { _id: request.params.rideId },
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
  PublishRide.findOne({ _id: request.params.rideId })
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
                console.log("enter 2");
                console.log(request.params.publierId);
                console.log(bookerId);
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
  let pr = await PublishRide.findOne({ _id: request.params.rideId })
    .populate("publisherRequest")
    .populate("otp.bookerId");

  let otp = pr.otp;
  let publisherRequest = pr.publisherRequest;
  let temp = [];
  let status = false;
  let i,
    k = 0;
  for (i = 0; i < publisherRequest.length; i++) {
    temp[i] = publisherRequest[i].mobile;
  }

  for (i = i; i < otp.length; i++, k++) {
    temp[i] = otp[k].bookerId.mobile;
  }

  await PublishRide.updateOne(
    { _id: request.params.rideId },
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
  var option = {
    authorization:
      "kAHrGWQ7EdUgB5sR6ehbCyLJuTnX82iPOc1pYZl9Sw0mzjvoK4fcXF9uO3AbhYdaBke2EVZWjLlPCyTz",
    message:
      "Your Request Cancelled By Publisher , PLease find onother ride .  Sorry for your inconvenience..",
    numbers: [temp],
  };
  await fast2sms.sendMessage(option);

  if (status) return response.status(200).json({ msg: "cancel" });
};

//Here we fetch particular ride
exports.getParticualRideRequest = (request, response) => {
  PublishRide.findOne({ _id: request.params.id })
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
  statusRide = false;
  totalRides = [];
  PublishRide.find({ fromId: request.body.from, toId: request.body.to })
    .populate("publisherId")
    .populate("fromId")
    .populate("toId")
    .then((rides) => {
      console.log("ID1 : " + rides.length);
      if (rides.length > 0) {
        for (let i = 0; i < rides.length; i++) {
          const d = new Date(rides[i].rideDate * 1);
          let date = d.toDateString();
          console.log(date + "==" + new Date(request.body.date).toDateString());
          if (
            date == new Date(request.body.date).toDateString() &&
            rides[i].seatAvailable >= request.body.seat
          ) {
            statusRide = true;
            totalRides[i] = rides[i];
          }
        }

        console.log(statusRide);
        if (statusRide) return response.status(200).json(totalRides);
      }
      return response.status(200).json(totalRides);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json(err);
    });
};

exports.cancelRideByBooker = async (request, response) => {
  let i;
  let publisher = await PublishRide.findOne({
    _id: request.params.rideId,
  }).populate("publisherId");
  let booker = await BookRide.findOne({ _id: request.params.bookRideId });
  publisher.historyOfUser.pull(request.params.bookerId);
  publisher.save();

  for (i = 0; publisher.otp.length; i++) {
    if (publisher.otp[i].bookerId == request.params.bookerId) break;
  }

  publisher = await PublishRide.findOne({
    _id: request.params.rideId,
  }).populate("publisherId");
  publisher.otp.splice(i, 1);
  publisher.save();

  await BookRide.deleteOne({ _id: request.params.bookRideId });

  PublishRide.updateOne(
    { _id: request.params.rideId },
    {
      seatAvailable: booker.seatWant + publisher.seatAvailable,
      isBooked: false,
    }
  )
    .then(async (result) => {
      var option = {
        authorization:
          "kAHrGWQ7EdUgB5sR6ehbCyLJuTnX82iPOc1pYZl9Sw0mzjvoK4fcXF9uO3AbhYdaBke2EVZWjLlPCyTz",
        message:
          "Your Request Cancelled By Booker, Your currently seatAvailable is " +
          (booker.seatWant + publisher.seatAvailable),
        numbers: [publisher.publisherId.mobile],
      };
      await fast2sms.sendMessage(option);
      return response.status(200).json(result);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
};
