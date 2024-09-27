function replicatePersonalEvents() {
  var personalCalendarId = 'm.pliss@gmail.com';
  var workCalendarId = 'm.pliss@solify.me';

  var personalCalendar = CalendarApp.getCalendarById(personalCalendarId);
  var workCalendar = CalendarApp.getCalendarById(workCalendarId);

  if (!personalCalendar || !workCalendar) {
    Logger.log('Ошибка: Не удалось найти один из календарей.');
    return;
  }

  var now = new Date();
  var end = new Date();
  end.setDate(now.getDate() + 30);
  var personalEvents = personalCalendar.getEvents(now, end);

  personalEvents.forEach(function(personalEvent) {
    var titleBusyRU = "Занято";
    var titleBusyEN = "Busy";
    var titleFreeRU = "Свободно";
    var titleFreeEN = "Free";
    var startTime = personalEvent.getStartTime();
    var endTime = personalEvent.getEndTime();
    
    // Генерация или получение уникального идентификатора
    var personalEventId = personalEvent.getId();
    var eventDescription = personalEvent.getDescription();
    
    var uniqueId = '';
    var uniqueIdPattern = /UniqueID:\s*([^\s]+)/;

    if (uniqueIdPattern.test(eventDescription)) {
      uniqueId = eventDescription.match(uniqueIdPattern)[1];
    } else {
      uniqueId = Utilities.getUuid(); // Генерация UUID
      personalEvent.setDescription(eventDescription + ' UniqueID: ' + uniqueId);
    }

    // Определяем тип события: "Занято" или "Свободно"
    var isFree = personalEvent.isAllDayEvent() || personalEvent.getTitle().toLowerCase().includes("free");
    var workTitle = isFree ? titleFreeRU : titleBusyRU;
    var workEvents = workCalendar.getEvents(startTime, endTime);
    var matchingEvent = null;

    for (var i = 0; i < workEvents.length; i++) {
      var description = workEvents[i].getDescription();
      if (description && description.includes('UniqueID: ' + uniqueId)) {
        matchingEvent = workEvents[i];
        break;
      }
    }

    try {
      if (matchingEvent) {
        // Обновляем время события в рабочем календаре, если оно изменилось
        if (matchingEvent.getStartTime().getTime() !== startTime.getTime() || 
            matchingEvent.getEndTime().getTime() !== endTime.getTime()) {
          matchingEvent.setTime(startTime, endTime);
        }
        // Обновляем заголовок в зависимости от статуса события
        if (matchingEvent.getTitle() !== workTitle) {
          matchingEvent.setTitle(workTitle);
        }
      } else {
        // Создаем новое событие, если его нет в рабочем календаре
        var newEvent = workCalendar.createEvent(workTitle, startTime, endTime);
        newEvent.setDescription('Original ID: ' + personalEventId + ' UniqueID: ' + uniqueId); // Сохраняем ID личного события и уникальный идентификатор
        newEvent.setVisibility(isFree ? CalendarApp.Visibility.DEFAULT : CalendarApp.Visibility.PRIVATE); // Свободные события публичные, занятые - приватные
      }
    } catch (e) {
      Logger.log('Ошибка при обработке события: ' + e.message);
    }
  });
}
