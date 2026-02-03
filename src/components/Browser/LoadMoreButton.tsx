interface LoadMoreButtonProps {
  loadMore: () => void;
  isLoading: boolean;
  disabled?: boolean;
  slot?: string;
  disabledIndentation?: boolean;
}

const LoadMoreButton = ({
  loadMore,
  isLoading,
  disabled = false,
  slot,
  disabledIndentation,
}: LoadMoreButtonProps) => {
  return (
    <cx-space direction="horizontal" slot={slot}>
      {!disabledIndentation && <div className="browser__load-more__indentation"></div>}
      <cx-button
        variant="text"
        size="small"
        onClick={loadMore}
        disabled={disabled}
        loading={isLoading}
        className="browser__load-more"
      >
        <cx-icon name="add" slot="prefix"></cx-icon>
        More
      </cx-button>
    </cx-space>
  );
};

export default LoadMoreButton;
