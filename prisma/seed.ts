import { PrismaClient } from "@prisma/client";
import * as faker from "faker";
import { hash } from "bcrypt";
const db = new PrismaClient();

const {
  user,
  guestProfile,
  hostProfile,
  wishList,
  house,
  review,
  booking,
  picture,
} = db;
const wholehousePics = [
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/358636/pexels-photo-358636.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
];
const bathroomPics = [
  "https://images.pexels.com/photos/3288104/pexels-photo-3288104.png?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/1909791/pexels-photo-1909791.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/3951742/pexels-photo-3951742.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
];
const bedroomPics = [
  "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
];
const kitchenPics = [
  "https://images.pexels.com/photos/2208891/pexels-photo-2208891.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/3277916/pexels-photo-3277916.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/4993062/pexels-photo-4993062.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/5824883/pexels-photo-5824883.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/5824485/pexels-photo-5824485.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
];
const livingRoomPics = [
  "https://images.pexels.com/photos/892618/pexels-photo-892618.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/3797991/pexels-photo-3797991.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/3705529/pexels-photo-3705529.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/4138152/pexels-photo-4138152.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  "https://images.pexels.com/photos/4488194/pexels-photo-4488194.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
];
const mockpassword = "test";

const forLoopArray = Array(5).fill("");

async function main() {
  const hosts = [];
  const guests = [];
  let i = -1;

  for await (const ele of forLoopArray) {
    const hashedPasseword = await hash(mockpassword, 10);
    i = i + 1;
    const randomBeds = Math.floor(5 - Math.random() * 4);

    const facilities = [
      "Shower",
      "Bidet",
      "Bathtub",
      "Balcony",
      "Spa",
      "Jacuzzi",
      "Parking",
      "Kitchen",
      "Garden",
      "TV",
    ];
    const randomInt = Math.floor(Math.random() * 7);

    const randomFacilities = [
      "Wifi",
      facilities[randomInt],
      facilities[randomInt + 1],
      facilities[randomInt + 2],
    ];

    // const houses = await house.create({
    //   data: {
    //     name: faker.random.words(4),
    //     bedrooms: randomBeds,
    //     maxGuests: 2 * randomBeds,
    //     facility: randomFacilities,
    //     city: faker.address.cityName(),
    //     price: Math.floor(100 - Math.random() * 20),
    //     hostId: 1,
    //     pictures: {
    //       createMany: {
    //         data: [
    //           { src: wholehousePics[i], alt: "whole house" },
    //           { src: bedroomPics[i], alt: "bedroom" },
    //           { src: livingRoomPics[i], alt: "living room" },
    //           { src: bathroomPics[i], alt: "bathroom" },
    //           { src: kitchenPics[i], alt: "kitchen" },
    //         ],
    //       },
    //     },
    //   },
    // });

    const host = await user.create({
      data: {
        username: faker.internet.exampleEmail().replace("@example.", "a"),
        password: hashedPasseword,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        hostRole: "host",
        avatar: faker.image.avatar(),
        hostProfile: {
          create: {
            bio: faker.lorem.sentence(),
            houses: {
              create: {
                name: faker.random.words(4),
                bedrooms: randomBeds,
                maxGuests: 2 * randomBeds,
                facility: randomFacilities,
                city: faker.address.cityName(),
                price: Math.floor(100 - Math.random() * 20),
                pictures: {
                  createMany: {
                    data: [
                      { src: wholehousePics[i], alt: "whole house" },
                      { src: bedroomPics[i], alt: "bedroom" },
                      { src: livingRoomPics[i], alt: "living room" },
                      { src: bathroomPics[i], alt: "bathroom" },
                      { src: kitchenPics[i], alt: "kitchen" },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    });
    hosts.push(host);

    const guest = await user.create({
      data: {
        username: faker.internet.exampleEmail().replace("@example.", "b"),
        password: hashedPasseword,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),

        guestRole: "guest",
        avatar: faker.image.avatar(),
        guestProfile: {
          create: {
            bio: faker.lorem.sentence(),
          },
        },
      },
    });

    guests.push(guest);
  }
  console.log("hosts", hosts);
  console.log("guests", guests);
}

//   model House {
//     id          Int         @id @default(autoincrement())
//     name        String
//     bedrooms    Int
//     maxGuests   Int
//     facility    String[]
//     city        String
//     wishList    WishList[]
//     hostProfile HostProfile @relation(fields: [hostId], references: [id], onDelete: Cascade)
//     hostId      Int
//     price       Int
//     reviews     Review[]
//     pictures    Picture[]
//     bookings    Booking[]
//   }

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await db.$disconnect();
  });
