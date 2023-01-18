import cheerio from 'cheerio';
import axios from 'axios';
import { createCookie } from './cookie-controller';

axios.defaults.withCredentials = true;

// HTTP GET FUNCTION
async function parseSchoolWeekPage(url, optionsToGetElement, cookieForLogIn){
  const { data } = await axios.get(url, { // получение html странички
    headers: {
      Cookie: cookieForLogIn
    }
  });
  const processedPage = cheerio.load(data); // передаём обработанную старничку в одну переменную 'processedPage'

  formLessonsInfo(processedPage, optionsToGetElement); // создания массива из информации об уроках
};

// HTTP POST FUNCTION для получения необходимых 'cookie'
export async function postHttp(url, body){
  await axios.post(url, body)
    .then(function (response) {
      const cookieForLogIn = response.headers['set-cookie'];

      // HTTP GET ЗАПРОС для созадния массива из информации об уроках (ПОТОМ: отправки в базу данных json переменную с информацией об уроках)
      parseSchoolWeekPage('https://edu.gounn.ru/journal-app/week.-1', // url для СЛЕДУЮЩИЕЙ НЕДЕЛИ
        {
          optionLessonNumber: '.dnevnik-lesson__number', // параметр для номера урока
          optionLessonName: '.js-rt_licey-dnevnik-subject', // параметр для названия урока
          optionLessonTime: '.dnevnik-lesson__time' // параметр для времени урока
        },
        cookieForLogIn); // полученные 'cookie'
    })
    .catch(function (error) { // если получили ошибку
      console.log(error);
    });
};

function formLessonsInfo (processedPage, optionsToGetElement) {
  const allLessons = []; // массив для уроков

  const allLessonsInfoWithWeekDays = { Понедельник: {}, Вторник: {}, Среда: {}, Четверг: {}, Пятница: {}, Суббота: {} }; // массив для распределения уроков по дням
  let dayIndexNum = 0; // Индекс дня в объекте

  const lessonNumber = getArrayByOptionElement(processedPage, optionsToGetElement.optionLessonNumber); // получаем массив данных для числа
  const lessonsNames = getArrayByOptionElement(processedPage, optionsToGetElement.optionLessonName); // получаем массив данных для имени
  const lessonTime = getArrayByOptionElement(processedPage, optionsToGetElement.optionLessonTime); // получаем массив данных для времени

  for (let i = 0; i < lessonsNames.length; i++) { // создаём объект, взяв одинаковые записи у всех массивов, и передаём его в массив. Получаем массив с объектами.
    if (Number(lessonNumber[i]) !== 0) {
      const lessonInfo = makeNewLessonObj(lessonNumber[i], lessonsNames[i], lessonTime[i]);
      allLessons.push(lessonInfo);
    }
  }

  for (let i = 0; i < allLessons.length - 1; i++) { // распределение уроков по дням
    allLessonsInfoWithWeekDays[Object.keys(allLessonsInfoWithWeekDays)[dayIndexNum]][Number(allLessons[i].lessonNumber)] = allLessons[i];
    // (нахождение названия ключа по индексу, ссылаемся на несуществующий ключ объекта, чтобы его создать и добавляем туда урок) добавление урока в определенный день в объекте

    if (Number(allLessons[i].lessonNumber) >= Number(allLessons[i + 1].lessonNumber)) { // если следующий урок меньше/равень настоящему, то значит он будет на следующий день, поэтому увеличиваем индекс дня на 1
      dayIndexNum++;
    }
  }
  console.log(allLessonsInfoWithWeekDays);
  return allLessonsInfoWithWeekDays;
}

function makeNewLessonObj (lessonNumber, lessonName, lessonTime) { // создаём объект для одного предмета
  lessonNumber = lessonNumber.trim(); // мы получаем неправильную строку, например, '\n       8', поэтому убираем всё лишнее, оставляя только число

  return {
    lessonNumber,
    lessonName,
    lessonTime
  };
}

function getArrayByOptionElement (processedPage, optionsToGetElementToArray) { // создаём и выводим массив данных на основе предоставленных параметров(номер/имя/время)
  return processedPage(optionsToGetElementToArray).map(
    function () {
      return processedPage(this).text();
    }).toArray();
}
