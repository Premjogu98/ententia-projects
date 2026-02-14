import logging
from config import config

RESET = "\033[0m"
COLORS = {
    "DEBUG": "\033[36m",  # Cyan
    "INFO": "\033[32m",  # Green
    "WARNING": "\033[33m",  # Yellow
    "ERROR": "\033[31m",  # Red
    "CRITICAL": "\033[41m",  # Red background
}


class ColorFormatter(logging.Formatter):
    def format(self, record):
        color = COLORS.get(record.levelname, "")
        record.levelname = f"{color}{record.levelname}{RESET}"
        return super().format(record)


formatter = ColorFormatter(
    "%(asctime)s,%(msecs)d %(levelname)-8s [ {} ] [%(pathname)s:%(lineno)d] %(message)s".format(
        config.SERVICE_NAME.upper().replace("_", " ")
    )
)


def setup_logger(name, log_file=None, level=logging.DEBUG):
    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.propagate = False

    if logger.handlers:
        return logger

    if log_file:
        handler = logging.FileHandler(log_file)
        handler.setFormatter(
            logging.Formatter(
                "%(asctime)s,%(msecs)d %(levelname)-8s [{}: %(pathname)s:%(filename)s:%(lineno)d] %(message)s".format(
                    config.SERVICE_NAME
                )
            )
        )
    else:
        handler = logging.StreamHandler()
        handler.setFormatter(formatter)

    logger.addHandler(handler)
    return logger


console_logger = setup_logger(f"{config.SERVICE_NAME}_console_logger")
