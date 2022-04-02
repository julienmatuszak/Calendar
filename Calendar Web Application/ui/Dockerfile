FROM adoptopenjdk/openjdk16:alpine-jre

ENV JAVA_ENABLE_DEBUG=${JAVA_ENABLE_DEBUG}

COPY build/libs/trck-*[A-Z].jar trck.jar
COPY entrypoint.sh .

RUN addgroup --system --gid 1001 appuser && \
    adduser --system --ingroup appuser --uid 1001 appuser

RUN chown appuser:appuser trck.jar
RUN chmod 500 trck.jar

RUN chown appuser:appuser ./entrypoint.sh
RUN chmod 500 ./entrypoint.sh

EXPOSE 8080

USER 1001

CMD ["./entrypoint.sh"]
