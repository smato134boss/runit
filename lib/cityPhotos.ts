export interface CityPhoto {
  url: string;
  author: string;
  license: string;
  sourceUrl: string;
}

export const CITY_PHOTOS: Record<string, CityPhoto> = {
  "toronto": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Skyline_of_Toronto_%2833560711480%29.jpg/1920px-Skyline_of_Toronto_%2833560711480%29.jpg",
    author: "David Baron",
    license: "CC BY-SA 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Skyline_of_Toronto_(33560711480).jpg",
  },
  "hamilton": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Hamilton-Panorama-20200801-005.jpg/1920px-Hamilton-Panorama-20200801-005.jpg",
    author: "Whpq",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hamilton-Panorama-20200801-005.jpg",
  },
  "vancouver": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Vancouver_skyline_%2849108244853%29.jpg/1920px-Vancouver_skyline_%2849108244853%29.jpg",
    author: "Murray Foubister",
    license: "CC BY-SA 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vancouver_skyline_(49108244853).jpg",
  },
  "ottawa": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Canadian_parliament_panorama_Ottawa_-_panoramio.jpg/1920px-Canadian_parliament_panorama_Ottawa_-_panoramio.jpg",
    author: "Martin Fiser",
    license: "CC BY 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Canadian_parliament_panorama_Ottawa_-_panoramio.jpg",
  },
  "calgary": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Calgary_skyline_from_the_northwest%2C_Alberta%2C_Canada.jpg/1920px-Calgary_skyline_from_the_northwest%2C_Alberta%2C_Canada.jpg",
    author: "Ethan Sahagun",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Calgary_skyline_from_the_northwest,_Alberta,_Canada.jpg",
  },
  "edmonton": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Edmonton_Skyline_April_2016.jpg/1920px-Edmonton_Skyline_April_2016.jpg",
    author: "Mack Male",
    license: "CC BY-SA 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Edmonton_Skyline_April_2016.jpg",
  },
  "mississauga": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Absolute_World_Towers_in_Mississauga_from_Enfield_Place.jpg/1920px-Absolute_World_Towers_in_Mississauga_from_Enfield_Place.jpg",
    author: "Sikander Iqbal",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Absolute_World_Towers_in_Mississauga_from_Enfield_Place.jpg",
  },
  "brampton": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Brampton_City_Hall_%2836851674943%29.jpg/1920px-Brampton_City_Hall_%2836851674943%29.jpg",
    author: "Jeff Hitchcock",
    license: "CC BY 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Brampton_City_Hall_(36851674943).jpg",
  },
  "london": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/View_of_Downtown_London%2C_Ontario_from_the_Kensington_Bridge.jpg/1920px-View_of_Downtown_London%2C_Ontario_from_the_Kensington_Bridge.jpg",
    author: "Gogerr",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:View_of_Downtown_London,_Ontario_from_the_Kensington_Bridge.jpg",
  },
  "kitchener": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Kitchener_Skyline_December_2021.jpg/1920px-Kitchener_Skyline_December_2021.jpg",
    author: "Tomasz Adamski",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kitchener_Skyline_December_2021.jpg",
  },
  "victoria": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Victoria_Harbor_BC.jpg/1920px-Victoria_Harbor_BC.jpg",
    author: "Grandmaster Huon",
    license: "CC0 1.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Victoria_Harbor_BC.jpg",
  },
  "kelowna": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Kelowna_DownTown_%2835166266513%29.jpg/1920px-Kelowna_DownTown_%2835166266513%29.jpg",
    author: "GoToVan",
    license: "CC BY 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kelowna_DownTown_(35166266513).jpg",
  },
  "montreal": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/20181012_-_01_-_Montreal_panorama_%28downtown%29.jpg/1920px-20181012_-_01_-_Montreal_panorama_%28downtown%29.jpg",
    author: "Andre Carrotflower",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:20181012_-_01_-_Montreal_panorama_(downtown).jpg",
  },
  "quebec-city": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Quebec_City_skyline_from_L%C3%A9vis.jpg/1920px-Quebec_City_skyline_from_L%C3%A9vis.jpg",
    author: "Quintin Soloviev",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Quebec_City_skyline_from_L%C3%A9vis.jpg",
  },
  "laval": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Cosmod%C3%B4me%2C_cit%C3%A9_de_l%27astronautique_%281%29.jpg/1920px-Cosmod%C3%B4me%2C_cit%C3%A9_de_l%27astronautique_%281%29.jpg",
    author: "Laurent Bélanger",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Cosmod%C3%B4me,_cit%C3%A9_de_l%27astronautique_(1).jpg",
  },
  "winnipeg": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Winnipeg_skyline_2025.jpg/1920px-Winnipeg_skyline_2025.jpg",
    author: "Quintin Soloviev",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Winnipeg_skyline_2025.jpg",
  },
  "saskatoon": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Downtown_Saskatoon_2018.jpg/1920px-Downtown_Saskatoon_2018.jpg",
    author: "Louis White",
    license: "CC BY-SA 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Downtown_Saskatoon_2018.jpg",
  },
  "regina": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Regina_skyline_%28cropped%29.jpg/1920px-Regina_skyline_%28cropped%29.jpg",
    author: "Quintin Soloviev",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Regina_skyline_(cropped).jpg",
  },
  "halifax": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Halifax_3483.jpg/1920px-Halifax_3483.jpg",
    author: "Dionysos1970",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Halifax_3483.jpg",
  },
  "moncton": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Monctonpano1.jpg/1920px-Monctonpano1.jpg",
    author: "Stu pendousmat",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Monctonpano1.jpg",
  },
  "fredericton": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Fredericton%2C_New_Brunswick_skyline.jpg/1920px-Fredericton%2C_New_Brunswick_skyline.jpg",
    author: "Quintin Soloviev",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Fredericton,_New_Brunswick_skyline.jpg",
  },
  "st-johns": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/St_John_Harbour_Newfoundland_%2827493429868%29.jpg/1920px-St_John_Harbour_Newfoundland_%2827493429868%29.jpg",
    author: "Michel Rathwell",
    license: "CC BY 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:St_John_Harbour_Newfoundland_(27493429868).jpg",
  },
  "charlottetown": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Charlottetown_skyline_2010.jpg/1920px-Charlottetown_skyline_2010.jpg",
    author: "MTLskyline",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Charlottetown_skyline_2010.jpg",
  },
};
