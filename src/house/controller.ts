import { Picture, User, House } from ".prisma/client"
import { Request, Response } from "express"
import db from "../database"
import { getFilteredHouses, modifiedHouses } from "./service"
import { Query } from "./service"

const { house, picture } = db

async function getAllHouses(req: Request, res: Response) {
  console.log("query", Object.keys(req.query).length)
  try {
    if (Object.keys(req.query).length) {
      const rawData = await getFilteredHouses(req.query as Query)
      const houses = await modifiedHouses(rawData)
      res.json(houses)
    } else {
      const rawData = await house.findMany({
        select: {
          id: true,
          name: true,
          bedrooms: true,
          maxGuests: true,
          facility: true,
          city: true,
          hostProfile: {
            select: {
              user: {
                select: {
                  username: true,
                  avatar: true,
                },
              },
            },
          },

          price: true,
          reviews: {
            select: {
              content: true,
              guestProfile: {
                select: {
                  user: {
                    select: {
                      username: true,
                      avatar: true,
                    },
                  },
                },
              },
            },
          },
          pictures: {
            select: {
              src: true,
              alt: true,
            },
          },
        },
      })

      const houses = await modifiedHouses(rawData)

      res.json(houses)
    }
  } catch (error) {
    res.json(error)
  }
}

async function deleteHouseById(req: Request, res: Response) {
  const houseId = Number(req.params.id)
  try {
    await house.delete({
      where: {
        id: houseId,
      },
    })
    res.json("this house of listing is deleted ")
  } catch (error) {
    res.json(error)
  }
}

async function getOneHouse(req: Request, res: Response) {
  const houseId = Number(req.params.id)

  try {
    const targetHouse = await house.findUnique({
      where: {
        id: houseId,
      },
      select: {
        id: true,
        name: true,
        bedrooms: true,
        maxGuests: true,
        facility: true,
        city: true,
        hostProfile: {
          select: {
            user: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        },

        price: true,
        reviews: {
          select: {
            content: true,
            guestProfile: {
              select: {
                user: {
                  select: {
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        pictures: {
          select: {
            src: true,
            alt: true,
          },
        },
      },
    })

    if (targetHouse?.pictures.length) {
      const modifiedHouse = await modifiedHouses([targetHouse])
      res.json(modifiedHouse[0])
    }
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

// media storage in cloud - Cloudinary
// npm i multer-storage-cloudinary cloudinary
async function createOneHouse(req: Request, res: Response) {
  // const { id } = req.currentUser as User
  console.log("request body", req.body)
  const { name, city, bedrooms, maxGuests, facility, price } = req.body

  const { pictures } = req.body
  console.log("pictures", pictures)
  // const images = pictures.map(picture => ({
  //   src: picture.file,
  //   alt: pictures.name,
  // }))
  // console.log("images", images)

  // try {
  //   const newHouse = await house.create({
  //     data: {
  //       name: name,
  //       city: city,
  //       pictures: {
  //         createMany: {
  //           data: [
  //             // images
  //             { src: pictures[0].file, alt: pictures[0].name },
  //             { src: pictures[1].file, alt: pictures[1].name },
  //             { src: pictures[2].file, alt: pictures[2].name },
  //           ],
  //         },
  //       },
  //       bedrooms: parseInt(bedrooms),
  //       maxGuests: parseInt(maxGuests),
  //       facility: facility,
  //       price: parseInt(price),
  //       hostId: 1,
  //     },
  //   })
  //   res.json(newHouse)
  // } catch (error) {
  //   console.log(error)
  //   res.json(error)
  // }
}

async function updateOneHouse(req: Request, res: Response) {
  const houseId = Number(req.params.id)
  try {
    const orginalHouseInfo = await house.findUnique({
      where: {
        id: houseId,
      },
    })
    const newHouseInfo = await house.update({
      where: {
        id: houseId,
      },
      data: {
        ...orginalHouseInfo,
        ...req.body,
      },
    })

    res.json(newHouseInfo)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

export {
  getAllHouses,
  deleteHouseById,
  getOneHouse,
  createOneHouse,
  updateOneHouse,
}
